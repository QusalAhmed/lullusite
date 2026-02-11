'use server'

// db
import db from '@/lib/drizzle-agent'
import { eq, inArray } from 'drizzle-orm'
import { orderTable, customerTable, productVariationTable, orderItemTable } from '@/db/index.schema'

// Auth
import getSession from '@/lib/get-session'

// Schema
import type { OrderSelectSchemaType } from '@/lib/validations/order.schema'
import { orderInsertSchema, orderSelectSchema } from '@/lib/validations/order.schema'

const merchantCreateOrder = async (data: OrderSelectSchemaType) => {
    const session = await getSession()

    const parsedOrder = orderInsertSchema.parse(data)

    let orderId: string | null = null

    await db.transaction(async (tx) => {
        const customer = await tx
            .select()
            .from(customerTable)
            .where(eq(customerTable.phone, parsedOrder.shippingPhone))
        let customerId = null
        if (customer.length === 0) {
            const newCustomerResult = await tx
                .insert(customerTable)
                .values({
                    name: parsedOrder.shippingFullName,
                    email: parsedOrder.shippingEmail || null,
                    phone: parsedOrder.shippingPhone,
                    division: parsedOrder.shippingDivision || null,
                    address: parsedOrder.shippingAddress,
                    userId: session.user.id,
                })
                .returning({ id: customerTable.id })

            if (newCustomerResult.length === 0) {
                throw new Error('Failed to create customer')
            }

            customerId = newCustomerResult[0].id
        } else {
            customerId = customer[0].id
        }

        const [orderCreateResult] = await tx
            .insert(orderTable)
            .values({
                ...parsedOrder,
                merchantId: session.user.id,
                customerId: customerId,
            })
            .returning({ id: orderTable.id })

        if (!orderCreateResult) {
            throw new Error('Failed to create order')
        }

        orderId = orderCreateResult.id

        const items = orderSelectSchema.parse(data).items
        const itemDetails = await tx
            .select({
                id: productVariationTable.id,
                sku: productVariationTable.sku,
                variationName: productVariationTable.name,
            })
            .from(productVariationTable)
            .where(inArray(productVariationTable.id, items.map(item => item.variationId)))
        const variationDetailsMap = new Map(
            itemDetails.map(variation => [variation.id, { sku: variation.sku, name: variation.variationName }])
        )

        // Insert order items
        const itemsInsertData = items.map(item => ({
            orderId: orderCreateResult.id,
            productVariationId: item.variationId,
            sku: variationDetailsMap.get(item.variationId)?.sku || '',
            variationName: variationDetailsMap.get(item.variationId)?.name || '',
            thumbnailUrl: item.thumbnailUrl,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineSubtotal: item.unitPrice * item.quantity,
            lineDiscountAmount: item.discountPrice,
            lineTotal: item.totalPrice,
        }))
        const itemsInsertResult = await tx
            .insert(orderItemTable)
            .values(itemsInsertData)
            .returning({id: orderItemTable.id})

        console.log('Inserted Items:', itemsInsertResult)

        if (itemsInsertResult.length < itemsInsertData.length) {
            throw new Error('Failed to insert some order items')
        }

        // Update amount
        const subtotalAmount = items.reduce((acc, item) =>
            acc + (item.unitPrice * item.quantity - item.discountPrice), 0)
        const discountAmount = parsedOrder.discountAmount || 0;
        const shippingAmount = parsedOrder.shippingAmount || 0;
        const totalAmount = subtotalAmount + shippingAmount - discountAmount;
        const amountPaid = parsedOrder.paymentStatus === 'partially_paid' ?
            parsedOrder.partialAmount || 0 : parsedOrder.paymentStatus === 'paid' ? totalAmount : 0;
        const amountDue = totalAmount - amountPaid;

        const orderAmountUpdateResult = await tx
            .update(orderTable)
            .set({
                subtotalAmount,
                discountAmount,
                shippingAmount,
                totalAmount,
                amountPaid,
                amountDue,
            })
            .where(
                eq(orderTable.id, orderCreateResult.id)
            ).returning({id: orderTable.id})
        console.log('Order Amount Updated:', orderAmountUpdateResult)

        if (orderAmountUpdateResult.length === 0) {
            new Error('Failed to update order amounts')
        }
    })

    return {
        success: true,
        message: 'Order created successfully',
        orderId
    }
}

export default merchantCreateOrder