'use server'

import db from '@/lib/drizzle-agent'
import { eq, desc } from 'drizzle-orm'
import { orderTrackingTable } from '@/db/index.schema'

export type StoreTrackingEvent = {
    id: string
    trackingMessage: string
    updatedAt: Date
}

export default async function getStoreTracking(orderId: string): Promise<StoreTrackingEvent[]> {
    return db.query.orderTrackingTable.findMany({
        columns: {
            id: true,
            trackingMessage: true,
            updatedAt: true,
        },
        where: eq(orderTrackingTable.orderId, orderId),
        orderBy: desc(orderTrackingTable.updatedAt),
    })
}

