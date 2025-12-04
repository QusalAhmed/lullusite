"use server";

import db from "@/lib/drizzle-agent";
import { incompleteOrderTable } from "@/db/incomplete-order.schema";
import { eq, and } from "drizzle-orm";

export async function getIncompleteOrder(phoneNumber: string, merchantId: string) {
    try {
        const incompleteOrder = await db.query.incompleteOrderTable.findFirst({
            where: and(
                eq(incompleteOrderTable.phoneNumber, phoneNumber),
                eq(incompleteOrderTable.merchantId, merchantId),
                eq(incompleteOrderTable.status, "active")
            ),
            with: {
                items: {
                    with: {
                        productVariation: true,
                    },
                },
            },
        });

        if (!incompleteOrder) {
            return {
                success: false,
                error: "Incomplete order not found",
            };
        }

        return {
            success: true,
            data: incompleteOrder,
        };
    } catch (error) {
        console.error("Error fetching incomplete order:", error);
        return {
            success: false,
            error: "Failed to fetch incomplete order",
        };
    }
}

