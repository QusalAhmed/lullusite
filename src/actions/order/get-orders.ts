'use server'

import { type DateRange } from "react-day-picker"

// db
import db from '@/lib/drizzle-agent'
import { eq, desc, and, sql, gte, lte, ilike } from 'drizzle-orm'
import { orderTable } from '@/db/index.schema'

// Status
import { OrderStatusType } from '@/db/order.schema'

// Auth
import getSession from '@/lib/get-session'

export type OrderSearchFilter = {
    searchFor: 'orderNumber' | 'customerName' | 'customerPhone'
    searchText: string
} | null

export default async function getOrders(
    status?: OrderStatusType,
    limit: number = 10,
    offset: number = 0,
    dateRange?: DateRange,
    filter?: OrderSearchFilter,
) {
    const session = await getSession()

    const searchCondition = filter?.searchText.trim()
        ? (() => {
            const pattern = `%${filter.searchText.trim()}%`
            switch (filter.searchFor) {
                case 'orderNumber':
                    return ilike(orderTable.orderNumber, pattern)
                case 'customerName':
                    return ilike(orderTable.customerName, pattern)
                case 'customerPhone':
                    return ilike(orderTable.customerPhone, pattern)
                default:
                    return undefined
            }
        })()
        : undefined

    try {
        const [orders, totalResult] = await Promise.all([
            db.query.orderTable.findMany({
                with: {
                    items: {
                        with: {
                            variation: {
                                with: {
                                    images: {
                                        with: {
                                            image: {
                                                columns: {
                                                    id: true,
                                                    thumbnailUrl: true,
                                                },
                                            },
                                        },
                                        columns: {},
                                        limit: 1,
                                    },
                                    product: {
                                        columns: {
                                            name: true,
                                        },
                                    }
                                },
                                columns: {},
                            },
                        },
                        columns: {
                            id: true,
                            variationName: true,
                            sku: true,
                            quantity: true,
                            unitPrice: true,
                            lineTotal: true,
                        },
                    },
                },
                columns: {
                    id: true,
                    customerPhone: true,
                    customerName: true,
                    status: true,
                    customerNote: true,
                    orderNumber: true,
                    totalAmount: true,
                    paymentStatus: true,
                    createdAt: true,
                },
                where: and(
                    eq(orderTable.merchantId, session.user.id),
                    status ? eq(orderTable.status, status) : undefined,
                    dateRange?.from ? gte(orderTable.createdAt, dateRange.from) : undefined,
                    dateRange?.to ? lte(orderTable.createdAt, dateRange.to) : undefined,
                    searchCondition,
                ),
                orderBy: [desc(orderTable.createdAt)],
                limit,
                offset,
            }),
            db.select({
                count: sql<number>`cast(count(*) as int)`,
            }).from(orderTable).where(
                and(
                    eq(orderTable.merchantId, session.user.id),
                    status ? eq(orderTable.status, status) : undefined,
                    dateRange?.from ? gte(orderTable.createdAt, dateRange.from) : undefined,
                    dateRange?.to ? lte(orderTable.createdAt, dateRange.to) : undefined,
                    searchCondition,
                )
            ),
        ])

        const total = totalResult[0]?.count ?? 0

        return {
            data: orders,
            total,
        }
    } catch (error) {
        console.log('Error fetching orders:', error)
        throw new Error('Failed to fetch orders')
    }
}

export type OrdersResponse = Awaited<ReturnType<typeof getOrders>>
export type GetOrdersType = OrdersResponse['data'][number]
