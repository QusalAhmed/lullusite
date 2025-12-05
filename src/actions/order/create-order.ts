'use server'

import { validatePhoneNumber } from '@/lib/phone-number'
import getMerchant from "@/lib/get-merchant";
import { nanoid } from 'nanoid';

// db
import db from "@/lib/drizzle-agent"
import { eq, and } from "drizzle-orm";

// Schema
import { orderTable, customerTable, orderItemTable, productVariationTable, productTable } from '@/db/index.schema'

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
    const [customer] = await db
        .select()
        .from(customerTable)
        .where(and(
            eq(customerTable.phone, orderData.phoneNumber),
            eq(customerTable.userId, merchant.merchantId),
        ))
        .limit(1);

    if (!customer) {
        await db
            .insert(customerTable)
            .values({
                userId: merchant.merchantId,
                name: orderData.name,
                phone: orderData.phoneNumber,
                address: orderData.address,
                division: orderData.division,
            });
    }

    // Create order
    const [orderId] = await db
        .insert(orderTable)
        .values({
            merchantId: merchant.merchantId,
            orderNumber: nanoid(10).toUpperCase(),
            customerName: orderData.name,
            customerPhone: orderData.phoneNumber,
            shippingAddressLine1: orderData.address,
            shippingFullName: orderData.name,
            shippingCity: orderData.division,
        })
        .returning({id: orderTable.id});

    // Order items insertion
    let subtotalAmount = 0;
    const orderItems = [];

    for (const variation of orderData.variations) {
        // Fetch product variation details with product info
        const [variationData] = await db
            .select({
                id: productVariationTable.id,
                name: productVariationTable.name,
                sku: productVariationTable.sku,
                price: productVariationTable.price,
                stock: productVariationTable.stock,
                weight: productVariationTable.weight,
                productId: productVariationTable.productId,
                productName: productTable.name,
                productNameLocal: productTable.name_local,
            })
            .from(productVariationTable)
            .innerJoin(productTable, eq(productVariationTable.productId, productTable.id))
            .where(eq(productVariationTable.id, variation.variationId))
            .limit(1);

        if (!variationData) {
            throw new Error(`Product variation ${variation.variationId} not found`);
        }

        // Check stock availability
        if (variationData.stock < variation.quantity) {
            throw new Error(`Insufficient stock for ${variationData.productName} - ${variationData.name}`);
        }

        // Calculate line totals
        const lineSubtotal = variationData.price * variation.quantity;

        orderItems.push({
            orderId: orderId.id,
            productVariationId: variation.variationId,
            productName: variationData.productName,
            productNameLocal: variationData.productNameLocal || '',
            sku: variationData.sku,
            variationName: variationData.name,
            quantity: variation.quantity,
            unitPrice: variationData.price,
            lineSubtotal: lineSubtotal,
            lineDiscountAmount: 0,
            lineTotal: lineSubtotal, // No discounts for now
            weight: variationData.weight,
        });

        subtotalAmount += lineSubtotal;

        // Update product variation stock
        await db
            .update(productVariationTable)
            .set({
                stock: variationData.stock - variation.quantity,
            })
            .where(eq(productVariationTable.id, variation.variationId));
    }

    // Insert all order items
    if (orderItems.length > 0)
        await db.insert(orderItemTable).values(orderItems);

    // Update order with calculated totals
    const totalAmount = subtotalAmount; // No shipping or discounts for now
    await db
        .update(orderTable)
        .set({
            subtotalAmount: subtotalAmount,
            totalAmount: totalAmount,
        })
        .where(eq(orderTable.id, orderId.id));

    return {
        success: true,
        orderId: orderId.id,
        totalAmount: totalAmount,
    };
}