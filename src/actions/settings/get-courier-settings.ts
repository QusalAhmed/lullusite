'use server';

import db from "@/lib/drizzle-agent";
import { eq } from "drizzle-orm";
import { courierTable } from "@/db/index.schema";
import getSession from "@/lib/get-session";

export default async function getCourierSettings() {
    const session = await getSession();

    if (!session) {
        return { success: false, error: "Unauthorized" } as const;
    }

    try {
        const rows = await db
            .select()
            .from(courierTable)
            .where(eq(courierTable.userId, session.user.id));

        return { success: true, data: rows } as const;
    } catch (error) {
        console.error("Error fetching courier settings", error);
        return { success: false, error: "Failed to fetch courier settings" } as const;
    }
}

