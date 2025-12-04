"use server";

import db from "@/lib/drizzle-agent";
import { incompleteOrderTable } from "@/db/incomplete-order.schema";
import { eq, and } from "drizzle-orm";

export async function markIncompleteOrderAbandoned(incompleteOrderId: string) {
    try {
        await db
            .update(incompleteOrderTable)
            .set({
                status: "abandoned",
                updatedAt: new Date(),
            })
            .where(eq(incompleteOrderTable.id, incompleteOrderId));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Error marking incomplete order as abandoned:", error);
        return {
            success: false,
            error: "Failed to mark incomplete order as abandoned",
        };
    }
}

export async function expireOldIncompleteOrders() {
    try {
        const now = new Date();

        await db
            .update(incompleteOrderTable)
            .set({
                status: "expired",
                updatedAt: now,
            })
            .where(
                and(
                    eq(incompleteOrderTable.status, "active"),
                )
            );

        return {
            success: true,
        };
    } catch (error) {
        console.error("Error expiring old incomplete orders:", error);
        return {
            success: false,
            error: "Failed to expire old incomplete orders",
        };
    }
}

