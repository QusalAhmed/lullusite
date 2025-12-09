'use server'

import { validatePhoneNumber } from '@/lib/phone-number'
import getMerchant from "@/lib/get-merchant";

// db
import db from "@/lib/drizzle-agent"
import { eq, and, inArray, sql } from "drizzle-orm";

// Queue
import { orderConfirmationQueue } from "@/lib/bullmq-agent"

// Schema
import {
    orderTable,
    customerTable,
    orderItemTable,
    productVariationTable,
    incompleteOrderTable
} from '@/db/index.schema'

interface OrderData {
    name: string;
    phoneNumber: string;
    address: string;
    division: string;
    remark: string;
    variations: Array<{
        variationId: string;
        quantity: number;
    }>;
}

export default async function createOrder(orderData: OrderData) {
    if (!validatePhoneNumber(orderData.phoneNumber).isValid) {
        throw new Error('Invalid phone number')
    }

    const merchant = await getMerchant()
    if (!merchant.success) {
        throw new Error(merchant.error)
    }

    // Create customer if not exists
    if (!merchant.merchantId) {
        throw new Error('Merchant ID not found')
    }
    let customerId: string;
    const [customer] = await db
        .select()
        .from(customerTable)
        .where(and(
            eq(customerTable.phone, orderData.phoneNumber),
            eq(customerTable.userId, merchant.merchantId),
        ))
        .limit(1);

    if (customer) {
        customerId = customer.id;
    } else {
        customerId = await db
            .insert(customerTable)
            .values({
                userId: merchant.merchantId,
                name: orderData.name,
                phone: orderData.phoneNumber,
                address: orderData.address,
                division: orderData.division,
            })
            .returning({id: customerTable.id})
            .then(res => res[0].id);
    }

    // Create order
    const [createdOrder] = await db
        .insert(orderTable)
        .values({
            merchantId: merchant.merchantId,
            customerId: customerId,
            customerName: orderData.name,
            customerPhone: orderData.phoneNumber,
            shippingAddressLine1: orderData.address,
            shippingFullName: orderData.name,
            shippingCity: orderData.division,
        })
        .returning();

    // Get product variation details
    if (orderData.variations.length !== 0) {
        const variationsDetails = await db
            .query
            .productVariationTable
            .findMany({
                columns: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    stock: true,
                    weight: true,
                },
                where: inArray(productVariationTable.id, orderData.variations.map(v => v.variationId)),
            });
        console.log('variationsDetails', variationsDetails);

        // Insert order item
        const orderItemInsertion = await db
            .insert(orderItemTable)
            .values(
                variationsDetails.map(variation => {
                    const quantity = orderData.variations.find(v =>
                        v.variationId === variation.id
                    )?.quantity || 0;

                    return {
                        orderId: createdOrder.id,
                        productVariationId: variation.id,
                        sku: variation.sku,
                        variationName: variation.name,
                        quantity: quantity,
                        unitPrice: variation.price,
                        lineSubtotal: variation.price * quantity,
                        lineDiscountAmount: 0,
                        lineTotal: variation.price * quantity,
                        weight: variation.weight
                    };
                })
            )
            .returning({
                id: orderItemTable.productVariationId,
                quantity: orderItemTable.quantity
            });
        console.log('orderItemInsertion', orderItemInsertion);

        // Update stock for all variations in a single query
        // Only update items that don't have unlimited stock (-1)
        const variationIdsToUpdate = orderItemInsertion.map(item => item.id);

        if (variationIdsToUpdate.length > 0) {
            // Build CASE statement for updating stock based on quantity ordered
            const caseStatement = sql`CASE
            ${productVariationTable.id}`;

            for (const item of orderItemInsertion) {
                caseStatement.append(sql` WHEN
                ${item.id}
                THEN
                ${productVariationTable.stock}
                -
                ${item.quantity}`);
            }

            caseStatement.append(sql` ELSE
            ${productVariationTable.stock}
            END`);

            await db
                .update(productVariationTable)
                .set({
                    stock: caseStatement,
                })
                .where(
                    and(
                        inArray(productVariationTable.id, variationIdsToUpdate),
                        // Don't update unlimited stock items
                        sql`${productVariationTable.stock}
                        != -1`
                    )
                );
        }
    }

    // Delete incomplete orders if any
    await db
        .delete(incompleteOrderTable)
        .where(and(
            eq(incompleteOrderTable.phoneNumber, orderData.phoneNumber),
            eq(incompleteOrderTable.merchantId, merchant.merchantId),
            eq(incompleteOrderTable.status, 'active'),
        ));

    // Queue order confirmation email
    await orderConfirmationQueue.add(
        'send-order-confirmation',
        {
            customerName: orderData.name,
            customerEmail: '',
            orderNumber: '',
            createdDate: new Date(createdOrder.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            phoneNumber: createdOrder.customerPhone,
            storeName: 'Our Store',
            supportEmail: process.env.SUPPORT_EMAIL || 'qusalcse@gmail.com',
            shippingFullName: createdOrder.shippingFullName,
            shippingAddressLine1: createdOrder.shippingAddressLine1,
            shippingCity: createdOrder.shippingCity,
            shippingPostalCode: createdOrder.shippingPostalCode || '',
            shippingCountry: createdOrder.shippingCountry,
            shippingPhone: createdOrder.shippingPhone || createdOrder.customerPhone,
            subtotalAmount: createdOrder.subtotalAmount,
            shippingAmount: createdOrder.shippingAmount,
            discountAmount: createdOrder.discountAmount,
            totalAmount: createdOrder.totalAmount,
            currency: createdOrder.currency,
            items: [],
        },
        {
            delay: 1000, // Delay 1 second to ensure order is fully saved
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        }
    );

    return {
        success: true,
    };
}