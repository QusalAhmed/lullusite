import db from '@/lib/drizzle-agent'
import {eq} from 'drizzle-orm'
import {orderTable} from '@/db/index.schema'

export default function getOrderInfo(orderId: string) {
    return db
        .query.orderTable
        .findFirst({
            columns: {
                orderNumber: true,
                shippingPhone: true,
                customerEmail: true,
                shippingFullName: true,
                shippingAddress: true,
                shippingCity: true,
                shippingPostalCode: true,
                shippingState: true,
                shippingCountry: true,
                status: true,
                currency: true,
                subtotalAmount: true,
                shippingAmount: true,
                discountAmount: true,
                paymentMethod: true,
                totalAmount: true,
                createdAt: true,
            },
            with: {
                items: {
                    columns: {
                        id: true,
                        quantity: true,
                        unitPrice: true,
                        lineSubtotal: true,
                        lineTotal: true,
                        lineDiscountAmount: true,
                        variationName: true,
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
                                }
                            },
                        }
                    },
                },
            },
            where: eq(orderTable.id, orderId),
        })
}