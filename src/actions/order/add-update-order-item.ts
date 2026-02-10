'use server';

//db
import db from '@/lib/drizzle-agent'
import { eq, and, inArray, sql, SQL } from 'drizzle-orm'
import { orderTable, orderItemTable, productVariationTable } from '@/db/index.schema'

export default async function addUpdateOrderItem(
    {orderId, merchantId, itemData}: {
        orderId: string;
        merchantId: string;
        itemData: Array<{
            variationId: string;
            quantity: number;
            unitPrice?: number;
            discountPrice?: number;
        }>;
    }
) {
    await db.transaction(async (tx) => {
        const [oldOrder] = await tx
            .query
            .orderTable
            .findMany({
                columns: {},
                where: and(
                    eq(orderTable.id, orderId),
                    eq(orderTable.merchantId, merchantId)
                ),
                with: {
                    items: {
                        columns: {
                            id: true,
                            productVariationId: true,
                        },
                    },
                },
                limit: 1,
            })

        if (!oldOrder) {
            throw new Error('Order not found or you do not have permission to update this order')
        }

        const currentItems = oldOrder.items ?? []

        const newVariationIds = itemData.map(i => i.variationId)

        // Delete removed items (current minus new)
        const itemsToDelete = currentItems.filter(currentItem => (
            !itemData.find(newItem => newItem.variationId === currentItem.productVariationId)
        ))

        const itemsToDeleteIds = itemsToDelete.map(item => item.id)

        if (itemsToDeleteIds.length > 0) {
            const itemDeleteResult = await tx
                .delete(orderItemTable)
                .where(
                    and(
                        eq(orderItemTable.orderId, orderId),
                        inArray(orderItemTable.id, itemsToDeleteIds)
                    )
                ).returning({ id: orderItemTable.id })

            console.log('Deleted Items:', itemDeleteResult)

            if (itemDeleteResult.length < itemsToDeleteIds.length) {
                throw new Error('Failed to delete some order items')
            }
        }

        // Determine items to insert (new minus current)
        const itemsToInsert = itemData.filter(item => (
            !currentItems.find(oldItem => oldItem.productVariationId === item.variationId)
        ))
        console.log('Items to Insert:', itemsToInsert)

        const variationDetails = await tx
            .query
            .productVariationTable
            .findMany({
                where: inArray(
                    productVariationTable.id,
                    newVariationIds
                ),
                columns: {
                    id: true,
                    sku: true,
                    name: true,
                    price: true,
                },
                with: {
                    images: {
                        with: {
                            image: {
                                columns: {
                                    thumbnailUrl: true,
                                },
                            },
                        },
                        limit: 1,
                    },
                },
            });
        const variationDetailsMap = new Map(variationDetails.map(v => [v.id, v]));

        // Insert items
        if (itemsToInsert.length !== 0) {
            const itemsInsertResult = await tx
                .insert(orderItemTable)
                .values(itemsToInsert.map(item => {
                    const unitPrice = item.unitPrice ?? variationDetailsMap.get(item.variationId)?.price ?? 0;
                    const discountAmount = item.discountPrice ?? 0;
                    return {
                        orderId: orderId,
                        productVariationId: item.variationId,
                        sku: variationDetailsMap.get(item.variationId)?.sku || '',
                        variationName: variationDetailsMap.get(item.variationId)?.name || '',
                        thumbnailUrl: variationDetailsMap.get(item.variationId)?.images?.[0]?.image?.thumbnailUrl || '',
                        quantity: item.quantity,
                        unitPrice: unitPrice,
                        lineSubtotal: unitPrice * item.quantity,
                        lineDiscountAmount: discountAmount,
                        lineTotal: (unitPrice * item.quantity) - discountAmount,
                    }
                }))
                .returning({ id: orderItemTable.id })

            console.log('Inserted Items:', itemsInsertResult)

            if (itemsInsertResult.length < itemsToInsert.length) {
                throw new Error('Failed to insert some order items')
            }
        }

        // Update existing items (intersection)
        const itemsToUpdate = itemData.filter(newItem => (
            currentItems.find(currentItem => currentItem.productVariationId === newItem.variationId)
        ))
        console.log('Items to Update:', itemsToUpdate)

        if (itemsToUpdate.length > 0) {
            const sqlChunksQuantity: SQL[] = [];
            const sqlChunksUnitPrice: SQL[] = [];
            const sqlChunksDiscount: SQL[] = [];
            const ids: string[] = [];

            sqlChunksQuantity.push(sql`(case`);
            sqlChunksUnitPrice.push(sql`(case`);
            sqlChunksDiscount.push(sql`(case`);

            for (const item of itemsToUpdate) {
                const resolvedUnitPrice = item.unitPrice ?? variationDetailsMap.get(item.variationId)?.price ?? 0
                const resolvedDiscount = item.discountPrice ?? 0

                sqlChunksQuantity.push(sql`when
                ${orderItemTable.productVariationId}
                =
                ${item.variationId}
                then
                ${item.quantity}`);
                sqlChunksUnitPrice.push(sql`when
                ${orderItemTable.productVariationId}
                =
                ${item.variationId}
                then
                ${resolvedUnitPrice}`);
                sqlChunksDiscount.push(sql`when
                ${orderItemTable.productVariationId}
                =
                ${item.variationId}
                then
                ${resolvedDiscount}`);
                ids.push(item.variationId);
            }

            sqlChunksQuantity.push(sql`end
            )`);
            sqlChunksUnitPrice.push(sql`end
            )`);
            sqlChunksDiscount.push(sql`end
            )`);

            const quantitySql: SQL = sql`${sql.join(sqlChunksQuantity, sql.raw(' '))}
            ::integer`;
            const unitPriceSql: SQL = sql`${sql.join(sqlChunksUnitPrice, sql.raw(' '))}
            ::numeric(10,2)`;
            const discountSql: SQL = sql`${sql.join(sqlChunksDiscount, sql.raw(' '))}
            ::numeric(10,2)`;

            const itemUpdateResult = await tx
                .update(orderItemTable)
                .set({
                    quantity: quantitySql,
                    unitPrice: unitPriceSql,
                    lineSubtotal: sql`${unitPriceSql}
                    *
                    ${quantitySql}`,
                    lineDiscountAmount: discountSql,
                    lineTotal: sql`(${unitPriceSql} * ${quantitySql})
                                   -
                                   ${discountSql}`,
                })
                .where(
                    and(
                        eq(orderItemTable.orderId, orderId),
                        inArray(orderItemTable.productVariationId, ids)
                    )
                ).returning({ id: orderItemTable.id })

            console.log('Updated Items:', itemUpdateResult)

            if (itemUpdateResult.length < ids.length) {
                throw new Error('Failed to update some order items')
            }
        }
    })

    return {
        success: true,
    }
}