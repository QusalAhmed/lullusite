'use server'

//db
import db from '@/lib/drizzle-agent'
import { eq, and, inArray } from 'drizzle-orm'
import { orderTable, orderItemTable, productVariationTable } from '@/db/index.schema'

// Auth
import getSession from '@/lib/get-session'

// Schema
import type { OrderSelectSchemaType } from '@/lib/validations/order.schema'
import { orderUpdateSchema, orderSelectSchema } from '@/lib/validations/order.schema'

const merchantUpdateOrder = async (data: OrderSelectSchemaType) => {
    const session = await getSession()

    const orderParams = orderUpdateSchema.parse(data)

    await db.transaction(async (tx) => {
        const orderUpdateResult = await tx
            .update(orderTable)
            .set(orderParams)
            .where(
                and(
                    eq(orderTable.id, orderParams.id),
                    eq(orderTable.merchantId, session.user.id)
                )
            ).returning({id: orderTable.id})

        if (orderUpdateResult.length === 0) {
            throw new Error('Order not found or you do not have permission to update this order')
        }

        const [currentItems] = await tx
            .query
            .orderTable
            .findMany({
                where: and(
                    eq(orderTable.id, orderParams.id),
                    eq(orderTable.merchantId, session.user.id)
                ),
                with: {
                    items: true,
                },
                columns: {},
            })

        const parsedOrder = orderSelectSchema.parse(data)
        const itemsNew = parsedOrder.items

        // Delete removed items
        const itemsToDelete = currentItems.items.filter(currentItem => (
            !itemsNew.find(newItem => newItem.variationId === currentItem.productVariationId)
        ))

        const itemsToDeleteIds = itemsToDelete.map(item => item.id)

        const itemDeleteResult = await tx
            .delete(orderItemTable)
            .where(
                inArray(orderItemTable.id, itemsToDeleteIds)
            ).returning({id: orderItemTable.id})

        console.log('Deleted Items:', itemDeleteResult)

        if (itemDeleteResult.length < itemsToDeleteIds.length) {
            throw new Error('Failed to delete some order items')
        }

        // Determine items to insert or update
        const itemsToInsert = itemsNew.filter(newItem => (
            !currentItems.items.find(currentItem => currentItem.productVariationId === newItem.variationId)
        ))
        const variationDetails = await tx
            .query
            .productVariationTable
            .findMany({
                where: inArray(
                    productVariationTable.id,
                    itemsToInsert.map(item => item.variationId)
                ),
                columns: {
                    id: true,
                    sku: true,
                    name: true,
                }
            });
        const variationDetailsMap = new Map(variationDetails.map(v => [v.id, v]));

        // Insert item
        if (itemsToInsert.length !== 0) {
            const itemsInsertData = itemsToInsert.map(item => ({
                orderId: orderParams.id,
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
        }

        // Update existing item
        const itemsToUpdate = itemsNew.filter(newItem => (
            currentItems.items.find(currentItem => currentItem.productVariationId === newItem.variationId)
        ))
        // Update existing items
        for (const item of itemsToUpdate) {
            const currentItem = currentItems.items.find(ci => ci.productVariationId === item.variationId)
            if (!currentItem) continue

            const itemUpdateResult = await tx
                .update(orderItemTable)
                .set({
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    lineSubtotal: item.unitPrice * item.quantity,
                    lineDiscountAmount: item.discountPrice,
                    lineTotal: item.totalPrice,
                })
                .where(
                    eq(orderItemTable.id, currentItem.id)
                ).returning({id: orderItemTable.id})

            console.log('Updated Item:', itemUpdateResult)

            if (itemUpdateResult.length === 0) {
                throw new Error(`Failed to update order item with id ${currentItem.id}`)
            }
        }

        // Update amount
        const subtotalAmount = itemsNew.reduce((acc, item) =>
                acc + (item.unitPrice * item.quantity - item.discountPrice), 0)
        const discountAmount = parsedOrder.discountAmount;
        const shippingAmount = parsedOrder.shippingAmount;
        const amountPaid = (parsedOrder.paymentStatus === 'partially_paid' ? (parsedOrder.partialAmount || 0) : 0);
        const totalAmount = subtotalAmount + shippingAmount - discountAmount;
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
                eq(orderTable.id, orderParams.id)
            ).returning({id: orderTable.id})
        console.log('Order Amount Updated:', orderAmountUpdateResult)

        if (orderAmountUpdateResult.length === 0) {
            new Error('Failed to update order amounts')
        }
    });

    return {
        success: true,
        message: 'Order updated successfully',
    }
}

export default merchantUpdateOrder