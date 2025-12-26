'use server'

// db
import db from '@/lib/drizzle-agent'
import { eq, and, inArray } from 'drizzle-orm'
import { orderTable } from '@/db/index.schema'

// Analytics
import eventManager from '@/lib/capi';

// Status
import { OrderStatusType } from '@/db/order.schema'

// Auth
import getSession from '@/lib/get-session'

export default async function updateOrderStatus(
    orderIds: string[],
    newStatus: OrderStatusType
) {
    const session = await getSession()

    try {
        const results = await db
            .update(orderTable)
            .set({ status: newStatus })
            .where(
                and(
                    eq(orderTable.merchantId, session.user.id),
                    inArray(orderTable.id, orderIds)
                )
            )
            .returning({ id: orderTable.id })

        const toReportPixelOrders = await db
            .query
            .orderTable
            .findMany({
                where: and(
                    eq(orderTable.merchantId, session.user.id),
                    inArray(orderTable.id, orderIds),
                    eq(orderTable.reportToPixel, false),
                ),
                columns: { id: true, orderNumber: true, totalAmount: true, currency: true },
                with: {
                    items: {
                        columns: {
                            id: true,
                        }
                    }
                }
            })

        for (const order of toReportPixelOrders) {
            console.log('Sending event to Facebook for order:', order.id);
            eventManager(session.user.id).catch((error) => {
                console.error('Error sending event to Facebook:', error);
            });
        }

        // Mark orders as reported to pixel
        await db
            .update(orderTable)
            .set({ reportToPixel: true })
            .where(
                and(
                    eq(orderTable.merchantId, session.user.id),
                    inArray(orderTable.id, toReportPixelOrders.map(o => o.id))
                )
            )

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