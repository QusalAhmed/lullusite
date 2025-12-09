'use server'

import { revalidatePath } from "next/cache";
import z from "zod"

// db
import db from "@/lib/drizzle-agent"
import { eq } from "drizzle-orm"
import { businessInformationTable } from "@/db/index.schema"

// Zod schema
import businessInformationSchema from "@/lib/validations/business-information.schema"

// Auth
import getSession from "@/lib/get-session"

export default async function updateBusinessInformation(data: z.infer<typeof businessInformationSchema>) {
    try {
        const parsedData = businessInformationSchema.safeParse(data);
        if (!parsedData.success) {
            return { success: false, error: "Invalid data" };
        }

        const session = await getSession();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const { businessName, address, email, phone, description, logoImageId } = parsedData.data;

        // Check if business information already exists
        const existingBusinessInfo = await db
            .select()
            .from(businessInformationTable)
            .where(eq(businessInformationTable.userId, session.user.id))
            .limit(1);

        if (existingBusinessInfo.length > 0) {
            // Update existing business information
            const updated = await db
                .update(businessInformationTable)
                .set({
                    businessName,
                    address: address || null,
                    email: email || null,
                    phone: phone || null,
                    description: description || null,
                    logoImageId: logoImageId || null,
                })
                .where(eq(businessInformationTable.userId, session.user.id))
                .returning();

            if (!updated || updated.length === 0) {
                return { success: false, error: "Failed to update business information" };
            }
        } else {
            // Create new business information
            const created = await db
                .insert(businessInformationTable)
                .values({
                    userId: session.user.id,
                    businessName,
                    address: address || null,
                    email: email || null,
                    phone: phone || null,
                    description: description || null,
                    logoImageId: logoImageId || null,
                })
                .returning();

            if (!created || created.length === 0) {
                return { success: false, error: "Failed to create business information" };
            }
        }

        revalidatePath('/merchant/profile');
        return { success: true, error: null };
    } catch (error) {
        console.error("Error updating business information:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

