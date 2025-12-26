'use server'

// Local
import getMerchant from "@/lib/get-merchant";
import {getRequestSource} from "@/lib/request";

// db
import db from "@/lib/drizzle-agent";
import { analyticsTable } from "@/db/index.schema";
import { eq } from "drizzle-orm";

// BullMQ
import { facebookEventQueue } from "@/lib/bullmq-agent";

export default async function eventManager(merchantId?: string) {
    if (!merchantId) {
        const merchant = await getMerchant();
        merchantId = merchant.merchantId;
    }

    const result = await db
        .select({
            accessToken: analyticsTable.facebookConversionApiKey,
            pixelId: analyticsTable.facebookPixelId,
        })
        .from(analyticsTable)
        .where(
            eq(analyticsTable.userId, merchantId)
        )
        .limit(1);
    const accessToken = result[0].accessToken;
    const pixelId = result[0].pixelId;

    if (!accessToken || !pixelId) {
        throw new Error('Facebook Conversion API key or pixel id not found for merchant');
    }

    const request =await getRequestSource();
    if(!request.referer) {
        throw new Error('No referer found in request');
    }

    await facebookEventQueue.add('Purchase', {
        accessToken,
        pixelId,
        request,
    });

    return { success: true };
}