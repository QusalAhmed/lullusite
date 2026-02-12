'use server'

import {revalidatePath} from "next/cache";

//db
import db from '@/lib/drizzle-agent'
import { eq, and, inArray, sql, SQL } from 'drizzle-orm'
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
        if (itemsToUpdate.length > 0) {
            const sqlChunksQuantity: SQL[] = [];
            const sqlChunksUnitPrice: SQL[] = [];
            const sqlChunksDiscount: SQL[] = [];
            const ids: string[] = [];

            sqlChunksQuantity.push(sql`(case`);
            sqlChunksUnitPrice.push(sql`(case`);
            sqlChunksDiscount.push(sql`(case`);

            for (const item of itemsToUpdate) {
                sqlChunksQuantity.push(sql`when ${orderItemTable.productVariationId} = ${item.variationId} then ${item.quantity}`);
                sqlChunksUnitPrice.push(sql`when ${orderItemTable.productVariationId} = ${item.variationId} then ${item.unitPrice}`);
                sqlChunksDiscount.push(sql`when ${orderItemTable.productVariationId} = ${item.variationId} then ${item.discountPrice}`);
                ids.push(item.variationId);
            }

            sqlChunksQuantity.push(sql`end)`);
            sqlChunksUnitPrice.push(sql`end)`);
            sqlChunksDiscount.push(sql`end)`);

            // Explicit casts are important here; otherwise Postgres may infer TEXT for the CASE expression.
            const quantitySql: SQL = sql`${sql.join(sqlChunksQuantity, sql.raw(' '))}::numeric(10,2)`;
            const unitPriceSql: SQL = sql`${sql.join(sqlChunksUnitPrice, sql.raw(' '))}::numeric(10,2)`;
            const discountSql: SQL = sql`${sql.join(sqlChunksDiscount, sql.raw(' '))}::numeric(10,2)`;

            const itemUpdateResult = await tx
                .update(orderItemTable)
                .set({
                    quantity: quantitySql,
                    unitPrice: unitPriceSql,
                    lineSubtotal: sql`${unitPriceSql} * ${quantitySql}`,
                    lineDiscountAmount: discountSql,
                    lineTotal: sql`(${unitPriceSql} * ${quantitySql}) - ${discountSql}`,
                })
                .where(
                    and(
                        eq(orderItemTable.orderId, orderParams.id),
                        inArray(orderItemTable.productVariationId, ids)
                    )
                ).returning({id: orderItemTable.id})

            console.log('Updated Items:', itemUpdateResult)

            if (itemUpdateResult.length < ids.length) {
                throw new Error('Failed to update some order items')
            }
        }

        // Update amount
        const subtotalAmount = itemsNew.reduce((acc, item) =>
            acc + (item.unitPrice * item.quantity - item.discountPrice), 0)
        const discountAmount = parsedOrder.discountAmount;
        const shippingAmount = parsedOrder.shippingAmount;
        const totalAmount = subtotalAmount + shippingAmount - discountAmount;
        const amountPaid = parsedOrder.paymentStatus === 'partially_paid' ?
            parsedOrder.partialAmount : parsedOrder.paymentStatus === 'paid' ? totalAmount : 0;
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

    // Revalidate the order page
    revalidatePath('/merchant/orders')

    return {
        success: true,
        message: 'Order updated successfully',
    }
}

export default merchantUpdateOrder