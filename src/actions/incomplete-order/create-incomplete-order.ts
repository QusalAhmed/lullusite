"use server";

import { getRequestSource } from "@/lib/request";

// db
import db from "@/lib/drizzle-agent";
import { incompleteOrderTable, incompleteOrderItemTable, pageTable, productVariationTable } from "@/db/index.schema";
import { eq, and, or } from "drizzle-orm";

// mail
import { sendEmail } from "@/lib/mail/incomplete-order/send-email";

interface CreateIncompleteOrderParams {
    phoneNumber: string;
    items: Array<{ variationId: string; quantity: number; }>;
    metadata: {
        customerName: string;
        address: string;
        division: string;
        remarks: string;
    };
}


export async function createIncompleteOrder(
    {phoneNumber, items, metadata}: CreateIncompleteOrderParams
) {
    // Capture request source (origin/host/protocol)
    const req = await getRequestSource();
    const storeSlug = req.referer?.split('/store/')[1]?.split('/')[0]

    if (!storeSlug) {
        return {
            success: false,
            error: "Store not found in referer",
        };
    }

    // Find merchant id
    const merchantId = await db
        .select()
        .from(pageTable)
        .where(eq(pageTable.slug, storeSlug))
        .limit(1)
        .then((res) => (res.length > 0 ? res[0].userId : null));

    if (!merchantId) {
        return {
            success: false,
            error: "Merchant not found for store slug",
        };
    }

    // Merge metadata with request URL info
    const mergedMetadata = {
        ...(typeof metadata === "object" && metadata !== null ? metadata : {}),
        ...req,
    };

    try {
        // Check if incomplete order already exists for this phone and merchant
        const existingOrder = await db.query.incompleteOrderTable.findFirst({
            where: and(
                eq(incompleteOrderTable.phoneNumber, phoneNumber),
                eq(incompleteOrderTable.merchantId, merchantId),
                eq(incompleteOrderTable.status, "active")
            ),
        });

        let incompleteOrderId: string;

        if (existingOrder) {
            // Update existing order
            await db
                .update(incompleteOrderTable)
                .set({
                    metadata: mergedMetadata,
                    updatedAt: new Date(),
                })
                .where(eq(incompleteOrderTable.id, existingOrder.id));

            // Delete existing items
            await db
                .delete(incompleteOrderItemTable)
                .where(eq(incompleteOrderItemTable.incompleteOrderId, existingOrder.id));

            incompleteOrderId = existingOrder.id;
        } else {
            const [newOrder] = await db
                .insert(incompleteOrderTable)
                .values({
                    phoneNumber,
                    merchantId,
                    customerName: metadata.customerName || null,
                    customerAddress: metadata.address || null,
                    metadata: mergedMetadata,
                })
                .returning();

            incompleteOrderId = newOrder.id;

            await sendEmail({
                merchantName: merchantId,
                merchantEmail: 'qusalcse@gmail.com',
                orderId: incompleteOrderId,
                createdDate: new Date().toLocaleTimeString(),
                supportEmail: 'lullusite.com',
                storeName: 'Jazakallah',
                phoneNumber,
            })
        }

        // Insert items
        if (items.length > 0) {
            const variationDetails = await db
                .select()
                .from(productVariationTable)
                .where(or(
                    ...items.map((item) => eq(productVariationTable.id, item.variationId))
                ))
                .limit(items.length)

            await db.insert(incompleteOrderItemTable).values(
                variationDetails.map((variation) => ({
                    incompleteOrderId,
                    productVariationId: variation.id,
                    variationName: variation.name,
                    unitPrice: variation.price,
                    quantity: items.find((item) => item.variationId === variation.id)?.quantity || 1,
                }))
            );
        }

        return {
            success: true,
            incompleteOrderId,
        };
    } catch (error) {
        console.error("Error creating incomplete order:", error);
        return {
            success: false,
            error: "Failed to create incomplete order",
        };
    }
}
