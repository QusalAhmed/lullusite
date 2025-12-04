"use server";

import db from "@/lib/drizzle-agent";
import { incompleteOrderTable } from "@/db/incomplete-order.schema";
import { eq } from "drizzle-orm";

export async function convertIncompleteOrder(
    incompleteOrderId: string,
    completedOrderId: string
) {
    try {
        await db
            .update(incompleteOrderTable)
            .set({
                status: "converted",
                convertedToOrderId: completedOrderId,
                updatedAt: new Date(),
            })
            .where(eq(incompleteOrderTable.id, incompleteOrderId));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Error converting incomplete order:", error);
        return {
            success: false,
            error: "Failed to convert incomplete order",
        };
    }
}


