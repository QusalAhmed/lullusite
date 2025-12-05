'use server';

// db
import db from "@/lib/drizzle-agent";
import { pageTable } from "@/db/index.schema";
import { eq } from "drizzle-orm";

// Lib
import { getRequestSource } from "@/lib/request";

export default async function getMerchant() {
    // Capture request source (origin/host/protocol)
    const req = await getRequestSource();
    const storeSlug = req.referer?.split('/store/')[1]?.split('/')[0]

    if (!storeSlug) {
        return {
            success: false,
            error: "Store not found in referer",
        };
    }

    // Find merchant
    const [merchant] = await db
        .select()
        .from(pageTable)
        .where(eq(pageTable.slug, storeSlug))
        .limit(1);

    const merchantId = merchant?.userId;

    if (!merchantId) {
        return {
            success: false,
            error: "Merchant not found for store slug",
        };
    }

    return {
        success: true,
        merchantId,
    };
}