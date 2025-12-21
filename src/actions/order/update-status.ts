'use server'

// db
import db from '@/lib/drizzle-agent'
import { eq, and, inArray } from 'drizzle-orm'
import { orderTable } from '@/db/index.schema'

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
        const result = await db
            .update(orderTable)
            .set({ status: newStatus })
            .where(
                and(
                    eq(orderTable.merchantId, session.user.id),
                    inArray(orderTable.id, orderIds)
                )
            )
            .returning({ id: orderTable.id, status: orderTable.status })

        return {
            success: true,
            updatedOrders: result,
        }
    } catch (error) {
        console.error('Error updating order status:', error)
        return {
            success: false,
            error: (error as Error).message,
        }
    }
}