'use server'

// db
import db from "@/lib/drizzle-agent"
import { eq, and, inArray } from "drizzle-orm"
import { orderTable } from "@/db/index.schema"

// Auth
import getSession from "@/lib/get-session"

const getOrders = async (orderIds: string[]) => {
    const session = await getSession()

    if (!orderIds?.length) return []

    return db
        .query
        .orderTable
        .findMany({
            where: and(
                eq(orderTable.merchantId, session.user.id),
                inArray(orderTable.id, orderIds),
            ),
            columns: {
                id: true,
                orderNumber: true,
                createdAt: true,

                currency: true,
                subtotalAmount: true,
                discountAmount: true,
                shippingAmount: true,
                totalAmount: true,

                status: true,
                paymentStatus: true,
                paymentMethod: true,

                customerName: true,
                customerPhone: true,
                customerEmail: true,

                shippingFullName: true,
                shippingPhone: true,
                shippingAddress: true,
                shippingCity: true,
                shippingPostalCode: true,
                shippingState: true,
                shippingCountry: true,

                customerNote: true,
                merchantNote: true,
            },
            with: {
                items: {
                    columns: {
                        id: true,
                        sku: true,
                        variationName: true,
                        quantity: true,
                        unitPrice: true,
                        lineSubtotal: true,
                        lineDiscountAmount: true,
                        lineTotal: true,
                    },
                    with: {
                        variation: {
                            with: {
                                images: {
                                    with: {
                                        image: {
                                            columns: {
                                                thumbnailUrl: true,
                                                altText: true,
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
                                },
                            },
                            columns: {},
                        },
                    },
                },
            },
        });
}

export type InvoiceOrdersResponse = Awaited<ReturnType<typeof getOrders>>

export default getOrders;