"use server"

// db
import db from '@/lib/drizzle-agent'
import { eq, and, gte, lte, count, sum } from 'drizzle-orm'
import { orderTable, productTable, customerTable } from '@/db/index.schema'

// Auth
import getSession from '@/lib/get-session'

export default async function getDashboard(range: { from?: string; to?: string }) {
    const session = await getSession()

    const order = await db
        .select({
            shippingStatus: orderTable.status,
            count: count(orderTable.id),
            sum: sum(orderTable.totalAmount).mapWith(Number),
        })
        .from(orderTable)
        .groupBy(orderTable.status)
        .where(
            and(
                eq(orderTable.merchantId, session.user.id),
                range?.from ? gte(orderTable.createdAt, new Date(range.from)) : undefined,
                range?.to ? lte(orderTable.createdAt, new Date(range.to)) : undefined,
            )
        )
    console.log('Order Grouped by Payment Status:', order)

    const productsCount = await db
        .$count(
            productTable,
            and(
                eq(productTable.merchantId, session.user.id),
                range?.from ? gte(productTable.createdAt, new Date(range.from)) : undefined,
                range?.to ? lte(productTable.createdAt, new Date(range.to)) : undefined,
            )
        )

    const customersCount = await db
        .$count(
            customerTable,
            and(
                eq(customerTable.userId, session.user.id),
                range?.from ? gte(customerTable.createdAt, new Date(range.from)) : undefined,
                range?.to ? lte(customerTable.createdAt, new Date(range.to)) : undefined,
            )
        )

    return {
        order,
        productsCount: productsCount,
        customersCount: customersCount,
    }
}

export type DashboardData = Awaited<ReturnType<typeof getDashboard>>