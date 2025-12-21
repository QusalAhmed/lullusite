'use server'

import { revalidatePath } from "next/cache";
import z from "zod"

// db
import db from "@/lib/drizzle-agent"
import { eq } from "drizzle-orm"
import { analyticsTable } from "@/db/index.schema"

// Auth
import getSession from "@/lib/get-session"

// Zod schema
import analyticsSchema from "@/lib/validations/analytics.schema"

export default async function updateAnalytics(data: z.infer<typeof analyticsSchema>) {
    const parsedData = analyticsSchema.safeParse(data);
    if (!parsedData.success) {
        return { success: false, error: "Invalid data", errors: parsedData.error.flatten() }
    }

    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" }

    try {
        // Check if analytics record exists for user
        const existingAnalytics = await db
            .select()
            .from(analyticsTable)
            .where(eq(analyticsTable.userId, session.user.id))
            .limit(1);

        const analyticsPayload = {
            facebookPixelId: parsedData.data.facebookPixelId || null,
            facebookConversionApiKey: parsedData.data.facebookConversionApiKey || null,
            facebookConversionApiVersion: parsedData.data.facebookConversionApiVersion || null,
            googleAnalyticsKey: parsedData.data.googleAnalyticsKey || null,
            googleAnalyticsMeasurementId: parsedData.data.googleAnalyticsMeasurementId || null,
            googleAdsConversionId: parsedData.data.googleAdsConversionId || null,
            googleAdsConversionLabel: parsedData.data.googleAdsConversionLabel || null,
            tiktokPixelId: parsedData.data.tiktokPixelId || null,
            tiktokAccessToken: parsedData.data.tiktokAccessToken || null,
            snapchatPixelId: parsedData.data.snapchatPixelId || null,
            linkedinPartnerId: parsedData.data.linkedinPartnerId || null,
            pinterestPixelId: parsedData.data.pinterestPixelId || null,
            customTrackingCode: parsedData.data.customTrackingCode || null,
            isEnabled: parsedData.data.isEnabled ?? true,
        };

        if (existingAnalytics.length > 0) {
            // Update existing record
            const updated = await db
                .update(analyticsTable)
                .set(analyticsPayload)
                .where(eq(analyticsTable.userId, session.user.id))
                .returning();

            if (!updated || updated.length === 0) {
                return { success: false, error: "Failed to update analytics" }
            }
        } else {
            // Create new record
            const created = await db
                .insert(analyticsTable)
                .values({
                    userId: session.user.id,
                    ...analyticsPayload
                })
                .returning();

            if (!created || created.length === 0) {
                return { success: false, error: "Failed to create analytics" }
            }
        }

        revalidatePath('/merchant/settings/analytics')
        return { success: true, error: null }
    } catch (err) {
        console.error('Analytics update error:', err);
        return { success: false, error: "Something went wrong" }
    }
}

