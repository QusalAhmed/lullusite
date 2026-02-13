'use server'

// db
import db from '@/lib/drizzle-agent'
import { eq, and, inArray } from 'drizzle-orm'
import { orderTable } from '@/db/index.schema'

// Analytics
import eventManager from '@/lib/capi'

// Status
import { OrderStatusType } from '@/db/order.schema'

// Auth
import getSession from '@/lib/get-session'

export default async function updateOrderStatus(
    orderIds: string[],
    newStatus: OrderStatusType
) {
    // Avoid Drizzle/SQL errors for `inArray(column, [])` and avoid needless work.
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
        return {
            success: true,
            updatedOrders: [],
        }
    }

    const session = await getSession()
    const merchantId = session?.user?.id

    if (!merchantId) {
        return {
            success: false,
            error: 'No merchant id found in session',
        }
    }

    if (newStatus === 'confirmed') {
        const ordersToConfirm = await db.query.orderTable.findMany({
            where: and(
                eq(orderTable.merchantId, merchantId),
                inArray(orderTable.id, orderIds),
            ),
            columns: {
                orderNumber: true,
                shippingPostalCode: true,
                shippingAddress: true,
            },
            with: {
                items: true,
            }
        })

        for (const order of ordersToConfirm) {
            if (order.items.length === 0) {
                return {
                    success: false,
                    error: `Order ${order.orderNumber} has no items and cannot be confirmed.`,
                }
            }
            if (!order.shippingAddress || !order.shippingPostalCode) {
                return {
                    success: false,
                    error: `Order ${order.orderNumber} is missing shipping address or postal code and cannot be confirmed.`,
                }
            }
        }
    }

    try {
        const results = await db
            .update(orderTable)
            .set({ status: newStatus })
            .where(and(eq(orderTable.merchantId, merchantId), inArray(orderTable.id, orderIds)))
            .returning({ id: orderTable.id })

        if (newStatus === 'confirmed') {
            const toReportPixelOrders = await db.query.orderTable.findMany({
                where: and(
                    eq(orderTable.merchantId, merchantId),
                    inArray(orderTable.id, orderIds),
                    eq(orderTable.reportToPixel, false)
                ),
                columns: {id: true, orderNumber: true, totalAmount: true, currency: true},
                with: {
                    items: {
                        columns: {
                            id: true,
                        },
                    },
                },
            })

            const successfullyReportedOrderIds: string[] = []

            if (toReportPixelOrders.length > 0) {
                // Build one manager once (fewer DB/lookups), then send events.
                const manager = await eventManager(merchantId)

                for (const order of toReportPixelOrders) {
                    try {
                        console.log('Sending event to Facebook for order:', order.id)
                        await manager.purchaseEvent(order.id)
                        successfullyReportedOrderIds.push(order.id)
                    } catch (e) {
                        // Don't fail the whole status update if pixel reporting fails.
                        console.error('Error sending purchase event for order:', order.id, e)
                    }
                }
            }

            // Mark only successfully reported orders as reported to pixel
            if (successfullyReportedOrderIds.length > 0) {
                await db
                    .update(orderTable)
                    .set({reportToPixel: true})
                    .where(
                        and(
                            eq(orderTable.merchantId, merchantId),
                            inArray(orderTable.id, successfullyReportedOrderIds)
                        )
                    )
            }
        }

        return {
            success: true,
            updatedOrders: results,
        }
    } catch (error) {
        console.error('Error updating order status:', error)
        return {
            success: false,
            error: (error as Error).message,
        }
    }
}