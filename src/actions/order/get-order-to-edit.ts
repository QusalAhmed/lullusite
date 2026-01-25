'use server'

// db
import db from '@/lib/drizzle-agent'
import { eq, and } from 'drizzle-orm'
import { orderTable } from '@/db/index.schema'

// Auth
import getSession from '@/lib/get-session'

const getOrderToEdit = async (orderId: string) => {
    const session = await getSession()

    return db
        .query
        .orderTable
        .findFirst({
            where: and(
                eq(orderTable.id, orderId),
                eq(orderTable.merchantId, session.user.id)
            ),
            with: {
                items: true,
            }
        })
}

export default getOrderToEdit

export type GetOrderToEditReturnType = Awaited<ReturnType<typeof getOrderToEdit>>