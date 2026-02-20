'use server'

import { validatePhoneNumber } from '@/lib/phone-number'
import getMerchant from "@/lib/get-merchant";
import createCustomer from "@/actions/customer/create-customer";
import { getRequestSource } from "@/lib/request";
import {ActionSourceType} from "@/db/order.schema";

// db
import db from "@/lib/drizzle-agent"
import { eq, and, inArray, sql } from "drizzle-orm";

// Queue
import { orderConfirmationQueue } from "@/lib/bullmq-agent"

// Schema
import {
    orderTable,
    orderItemTable,
    productVariationTable,
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

export default async function createOrder(orderData: OrderData, actionSource?: ActionSourceType) {
    const phoneValidation = validatePhoneNumber(orderData.phoneNumber);
    if (!phoneValidation.isValid) {
        throw new Error('Invalid phone number')
    }

    const merchant = await getMerchant()

    const {customerId} = await createCustomer({
        phoneNumber: phoneValidation.normalized || orderData.phoneNumber,
        name: orderData.name,
        merchantId: merchant.merchantId,
        address: orderData.address,
        division: orderData.division,
    });

    // Create order
    const requestSource = await getRequestSource();
    console.log('Request Source:', requestSource);
    const deliveryCharge = 50;


    const [createdOrder] = await db
        .insert(orderTable)
        .values([
            {
                // Relations
                customerId,
                merchantId: merchant.merchantId,

                // Shipping details
                shippingAddress: orderData.address,
                shippingFullName: orderData.name,
                shippingPhone: phoneValidation.normalized || orderData.phoneNumber,
                shippingPostalCode: '', // TODO: postal code field
                shippingCountry: 'Bangladesh',
                shippingCity: orderData.division,
                shippingDivision: orderData.division,
                shippingAmount: deliveryCharge,
                // repeatOrder: isOldCustomer,

                // Payment details
                paymentMethod: "Cash on Delivery",

                // Analytics
                ipAddress: requestSource.ipAddress || '0.0.0.0',
                userAgent: requestSource.userAgent || 'unknown',
                actionSource: actionSource || 'website',
                eventSourceUrl: requestSource.referer || requestSource.origin || 'unknown',
                fbc: requestSource.fbc,
                fbp: requestSource.fbp || '',
                sourceChannel: {
                    channel: 'website',
                    source: requestSource.referer || requestSource.origin || 'unknown',
                },
            },
        ])
        .returning();

    // Get product variation details
    if (orderData.variations.length !== 0) {
        const variationsDetails = await db
            .query
            .productVariationTable
            .findMany({
                with: {
                    images: {
                        with: {
                            image: {
                                columns: {
                                    thumbnailUrl: true
                                },
                            },
                        },
                        limit: 1,
                    },
                },
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

        const subtotalAmount = variationsDetails.reduce((sum, variation) => {
            const quantity = orderData.variations.find(v =>
                v.variationId === variation.id
            )?.quantity || 0;
            return sum + (variation.price * quantity);
        }, 0);

        // Update order with subtotal amount
        const totalAmount = subtotalAmount + deliveryCharge;
        await db
            .update(orderTable)
            .set({
                subtotalAmount: subtotalAmount,
                totalAmount: totalAmount,
                amountDue: totalAmount,
            })
            .where(eq(orderTable.id, createdOrder.id));

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
                        thumbnailUrl: variation.images[0]?.image.thumbnailUrl,
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
        .delete(orderTable)
        .where(and(
            eq(orderTable.shippingPhone, phoneValidation.normalized || orderData.phoneNumber),
            eq(orderTable.merchantId, merchant.merchantId),
            eq(orderTable.status, 'incomplete_order'),
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
            shippingAddressLine1: createdOrder.shippingAddress,
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
        orderId: createdOrder.id,
    };
}