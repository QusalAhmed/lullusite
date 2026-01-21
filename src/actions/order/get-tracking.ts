'use server';

//db
import db from '@/lib/drizzle-agent'
import { eq, and, desc } from 'drizzle-orm'
import { orderTable, orderTrackingTable } from '@/db/index.schema'

// Auth
import getSession from '@/lib/get-session'

async function getTracking(orderId: string) {
    const merchant = await getSession()

    // Verify order belongs to merchant
    const order = await db
        .query
        .orderTable
        .findFirst({
            where: and(
                eq(orderTable.id, orderId),
                eq(orderTable.merchantId, merchant.user.id),
            ),
            columns: {
                id: true,
            },
        })

    if (!order) {
        throw new Error('Order not found or does not belong to merchant.')
    }

    return db
        .query
        .orderTrackingTable
        .findMany({
            columns: {
                id: true,
                trackingMessage: true,
                updatedAt: true,
            },
            where: eq(orderTrackingTable.orderId, orderId),
            orderBy: desc(orderTrackingTable.updatedAt),
        })
}

export default getTracking;