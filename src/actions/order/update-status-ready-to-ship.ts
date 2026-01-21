'use server'

import axios from 'axios'
import updateOrderStatus from './update-status'

// db
import db from '@/lib/drizzle-agent'
import { eq, and, inArray, sql, SQL } from 'drizzle-orm'
import { courierTable, orderTable, steadfastParcelTable } from '@/db/index.schema'

// Auth
import getSession from '@/lib/get-session'

export default async function updateOrdersReadyToShip(order: { orderId: string, courier: string }[]) {
    const merchant = await getSession()

    const orderIds = order.map(o => o.orderId)
    const response = await updateOrderStatus(orderIds, 'ready_to_ship')
    if (!response.success) {
        return {success: false, error: response.error}
    }

    // Courier booking
    const orderDetails = await db
        .query
        .orderTable
        .findMany({
            columns: {
                id: true,
                orderNumber: true,
                shippingFullName: true,
                shippingPhone: true,
                shippingAddress: true,
                amountDue: true,
                shippingNotes: true,
            },
            with: {
                items: {
                    columns: {
                        variationName: true,
                        quantity: true,
                        weight: true,
                    },
                }
            },
            where: and(
                inArray(orderTable.id, order.map(o => o.orderId)),
                eq(orderTable.merchantId, merchant.user.id),
            ),
        })

    // Steadfast
    const orderSteadfast = order.filter(o => o.courier === 'steadfast')
    if (orderSteadfast.length > 0) {
        const steadfastCourier = await db.query.courierTable.findFirst({
            where: and(
                eq(courierTable.courierCode, 'steadfast'),
                eq(courierTable.userId, merchant.user.id),
            ),
            columns: {
                id: true,
                apiKey: true,
                apiSecret: true,
            },
        })
        if (steadfastCourier && steadfastCourier.apiKey && steadfastCourier.apiSecret) {
            const baseUrl = 'https://portal.packzy.com/api/v1'
            const parcelData = orderSteadfast
                .map(o => {
                    const details = orderDetails.find(od => od.id === o.orderId)
                    const totalWeight = details?.items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0) || 0
                    if (details == null) return null
                    return {
                        invoice: details.id,
                        recipient_name: details.shippingFullName || 'N/A',
                        recipient_address: details.shippingAddress || 'N/A',
                        recipient_phone: details.shippingPhone || '',
                        cod_amount: details.amountDue,
                        note: `Weight: ${totalWeight} kg` + details.shippingNotes && ` | Notes: ${details.shippingNotes}`,
                        item_description: details.items.map(i => `${i.variationName} (x${i.quantity})`).join(', '),
                    }
                })
                .filter(item => item !== null) as Array<{
                invoice: string
                recipient_name: string
                recipient_address: string
                recipient_phone: string
                cod_amount: number
                note: string
            }>
            try {
                const response = await axios.post(`${baseUrl}/create_order/bulk-order`, {
                    data: JSON.stringify(parcelData),
                }, {
                    headers: {
                        'Api-Key': steadfastCourier.apiKey,
                        'Secret-Key': steadfastCourier.apiSecret,
                        'Content-Type': 'application/json',
                    },
                })
                console.log('Steadfast create order response:', response.data)

                // Process response and save tracking info to DB if needed
                const createdParcels: {
                    invoice: string;
                    status: string;
                    error: string;
                    consignment_id: string;
                    tracking_code: string;
                }[] = response.data.data || []

                const errorParcels = createdParcels.filter(p => p.status !== 'success')
                const successfulParcels = createdParcels.filter(p => p.status === 'success')

                // Save successful parcels to steadfast_parcel table
                if (successfulParcels.length > 0) {
                    await db
                        .insert(steadfastParcelTable)
                        .values(
                            successfulParcels.map(p => ({
                                orderId: p.invoice,
                                consignmentId: p.consignment_id,
                                trackingCode: p.tracking_code,
                            }))
                        )

                    // Update orders as courier booked
                    const caseSql = sql.join(
                        successfulParcels.map(parcel =>
                            sql`when ${orderTable.id} = ${parcel.invoice} then ${parcel.consignment_id}`
                        ),
                        sql` `,
                    )
                    const finalSql: SQL = sql`(case ${caseSql} end)`
                     await db
                         .update(orderTable)
                         .set({
                             isCourierBooked: true,
                             consignmentsId: finalSql,
                         })
                         .where(and(
                             inArray(orderTable.id, successfulParcels.map(p => p.invoice)),
                             eq(orderTable.merchantId, merchant.user.id),
                         ))
                }

                return {
                    success: true,
                    message: errorParcels.length > 0
                        ? `Some parcels failed to create: ${errorParcels.map(p => `${p.invoice} (${p.error})`).join(', ')}`
                        : 'All parcels created successfully'
                }
            } catch (error) {
                console.error('Steadfast create order error:', error)
                return {success: false, message: error || 'Steadfast create order failed'}
            }
        } else {
            return {success: false, message: 'Steadfast courier credentials not found'}
        }
    }

    // Default return for other couriers or empty orders
    return {success: true, message: 'Orders updated to ready to ship'}
}