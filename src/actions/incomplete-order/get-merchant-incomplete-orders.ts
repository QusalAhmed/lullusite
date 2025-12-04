"use server";

import db from "@/lib/drizzle-agent";
import { incompleteOrderTable } from "@/db/incomplete-order.schema";
import { eq, and, desc } from "drizzle-orm";

export async function getIncompleteOrdersByMerchant(
    merchantId: string,
    status?: "active" | "expired" | "converted" | "abandoned"
) {
    try {
        const whereConditions = [eq(incompleteOrderTable.merchantId, merchantId)];

        if (status) {
            whereConditions.push(eq(incompleteOrderTable.status, status));
        }

        const incompleteOrders = await db.query.incompleteOrderTable.findMany({
            where: and(...whereConditions),
            with: {
                items: {
                    with: {
                        productVariation: true,
                    },
                },
            },
            orderBy: [desc(incompleteOrderTable.createdAt)],
        });

        return {
            success: true,
            data: incompleteOrders,
        };
    } catch (error) {
        console.error("Error fetching incomplete orders by merchant:", error);
        return {
            success: false,
            error: "Failed to fetch incomplete orders",
        };
    }
}

