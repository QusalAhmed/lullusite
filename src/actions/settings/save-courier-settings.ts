'use server';

import { and, eq } from "drizzle-orm";
import db from "@/lib/drizzle-agent";
import { courierTable } from "@/db/index.schema";
import courierSettingsFormSchema, { CourierSettingsFormValues } from "@/lib/validations/courier.schema";
import getSession from "@/lib/get-session";
import { revalidatePath } from "next/cache";

export default async function saveCourierSettings(data: CourierSettingsFormValues) {
    const session = await getSession();

    if (!session) {
        return { success: false, error: "Unauthorized" } as const;
    }

    const parsed = courierSettingsFormSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, error: "Invalid courier settings" } as const;
    }

    const userId = session.user.id;

    const values = parsed.data;

    try {
        const entries = Object.values(values);

        for (const courier of entries) {
            // Normalize empty strings to null for DB
            const payload = {
                userId,
                courierCode: courier.courierCode,
                courierName: courier.courierName || null,
                apiKey: courier.apiKey || null,
                username: courier.username || null,
                apiSecret: courier.apiSecret || null,
                accountId: courier.accountId || null,
                isEnabled: courier.isEnabled,
            };

            const existing = await db
                .select({ id: courierTable.id })
                .from(courierTable)
                .where(and(eq(courierTable.userId, userId), eq(courierTable.courierCode, courier.courierCode)))
                .limit(1);

            if (existing.length > 0) {
                await db
                    .update(courierTable)
                    .set(payload)
                    .where(and(eq(courierTable.userId, userId), eq(courierTable.courierCode, courier.courierCode)));
            } else {
                await db.insert(courierTable).values(payload);
            }
        }

        revalidatePath("/merchant/(settings)/settings/courier");

        return { success: true } as const;
    } catch (error) {
        console.error("Error saving courier settings", error);
        return { success: false, error: "Failed to save courier settings" } as const;
    }
}

