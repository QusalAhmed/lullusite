'use server'

// local
import { validatePhoneNumber } from '@/lib/phone-number'
import getMerchant from "@/lib/get-merchant";
import createCustomer from "@/actions/customer/create-customer";
import getDeliveryCharge from "@/actions/delivery-charge/get-delivery-charge";
import addUpdateOrderItem from "@/actions/order/add-update-order-item";
import { getRequestSource } from "@/lib/request";
import {incompleteOrderQueue} from "@/lib/bullmq-agent";

// db
import db from "@/lib/drizzle-agent"
import { eq, and, or, inArray } from "drizzle-orm";
import { orderTable, productVariationTable } from "@/db/index.schema";

// type
import CreateOrderDataType from "@/types/create-order"

export default async function createIncompleteOrder(orderData: CreateOrderDataType) {
    const phoneValidation = validatePhoneNumber(orderData.phoneNumber);
    if (!phoneValidation.isValid) {
        throw new Error('Invalid phone number')
    }

    const merchant = await getMerchant()
    const {customerId, isOldCustomer} = await createCustomer({
        phoneNumber: phoneValidation.normalized || orderData.phoneNumber,
        name: orderData.name || '',
        merchantId: merchant.merchantId,
        address: orderData.address,
        division: orderData.division,
    });

    // Create or update incomplete order
    const requestSource = await getRequestSource();
    console.log('Request Source:', requestSource);
    const deliveryCharge = getDeliveryCharge();

    // Handle order item
    let subtotalAmount = 0;
    // Get product variation details
    if (orderData.variations && orderData.variations.length !== 0) {
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

        subtotalAmount = variationsDetails.reduce((sum, variation) => {
            const quantity = orderData.variations?.find(v =>
                v.variationId === variation.id
            )?.quantity || 0;
            return sum + (variation.price * quantity);
        }, 0);
    }

    let orderId: string | null;
    const shippingAddress = orderData.address?.trim();
    // const postalCode = shippingAddress ? await getPostalCode(shippingAddress) : undefined;

    const [existingOrder] = await db
        .select()
        .from(orderTable)
        .where(and(
            eq(orderTable.customerId, customerId),
            eq(orderTable.merchantId, merchant.merchantId),
            or(
                eq(orderTable.status, 'incomplete_order'),
                eq(orderTable.status, 'pending'),
            )
        ))
        .limit(1);
    if (existingOrder) {
        orderId = existingOrder.id;
        await db
            .update(orderTable)
            .set({
                // Shipping details
                shippingAddress: shippingAddress,
                shippingFullName: orderData.name,
                shippingPhone: phoneValidation.normalized || orderData.phoneNumber,
                shippingCity: orderData.division,
                shippingDivision: orderData.division,
                shippingAmount: deliveryCharge,

                // Monetary totals
                subtotalAmount: subtotalAmount || 0,
                totalAmount: subtotalAmount + deliveryCharge,
                amountDue: subtotalAmount + deliveryCharge,

                // Analytics
                ipAddress: requestSource.ipAddress || '',
                userAgent: requestSource.userAgent || '',
                actionSource: 'website',
                eventSourceUrl: requestSource.referer || requestSource.origin || 'unknown',
                fbc: requestSource.fbc,
                fbp: requestSource.fbp || '',
                sourceChannel: {
                    channel: 'website',
                    source: orderData.source || (requestSource.referer || requestSource.origin) || 'unknown',
                },
            })
            .where(eq(orderTable.id, existingOrder.id));
    } else {
        const [insertionResult] = await db
            .insert(orderTable)
            .values({
                // Relations
                customerId,
                merchantId: merchant.merchantId,

                // Shipping details
                shippingAddress: shippingAddress || '',
                shippingFullName: orderData.name || '',
                shippingPhone: phoneValidation.normalized || orderData.phoneNumber,
                shippingCity: orderData.division || '',
                shippingDivision: orderData.division || '',
                shippingAmount: deliveryCharge,

                // Status
                status: 'incomplete_order',
                repeatOrder: isOldCustomer,

                // Monetary totals
                subtotalAmount: subtotalAmount || 0,
                totalAmount: subtotalAmount + deliveryCharge,
                amountDue: subtotalAmount + deliveryCharge,

                // Analytics
                ipAddress: requestSource.ipAddress || '',
                userAgent: requestSource.userAgent || '',
                actionSource: 'website',
                eventSourceUrl: requestSource.referer || requestSource.origin || 'unknown',
                fbc: requestSource.fbc,
                fbp: requestSource.fbp || '',
                sourceChannel: {
                    channel: 'website',
                    source: orderData.source || (requestSource.referer || requestSource.origin) || 'unknown',
                },
            }).returning({ id: orderTable.id });

        orderId = insertionResult.id;

        // Send mail
        await incompleteOrderQueue.add("send-incomplete-order-email", {
            merchantName: 'Qus Al CSE',
            merchantEmail: 'qusalcse@gmail.com',
            orderId: orderId,
            createdDate: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
            supportEmail: 'lullusite.com',
            storeName: 'Jazakallah',
            phoneNumber: phoneValidation.normalized || orderData.phoneNumber,
        }, {
            delay: 60 * 1000, // 1 minutes delay
        });
    }

    if(orderData.variations && orderData.variations.length > 0) {
        await addUpdateOrderItem({
            orderId: orderId,
            merchantId: merchant.merchantId,
            itemData: orderData.variations.map(variation => ({
                variationId: variation.variationId,
                quantity: variation.quantity,
            })),
        });
    }

    return {
        success: true,
    }
}