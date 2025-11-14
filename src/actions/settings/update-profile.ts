'use server'

import { revalidatePath } from "next/cache";
import z from "zod"

// db
import db from "@/lib/drizzle-agent"
import { eq } from "drizzle-orm"
import { user } from "@/db/index.schema"

// Zod schema
import userSchema from "@/lib/zod/user.schema"

// Auth
import getSession from "@/lib/get-session"

export default async function updateProfile(data: z.infer<typeof userSchema>) {
    const parsedData = z.safeParse(userSchema, data)
    if (!parsedData.success) return {success: false, error: "Invalid data"}
    const session = await getSession();

    revalidatePath('/merchant/profile')

    const {name, address, businessName, details} = parsedData.data;

    if (name) {
        const nameUpdate = await db
            .update(user)
            .set({
                name: name,
            }).where((eq(user.id, session.user.id)))
            .returning()

        if (!nameUpdate) return {success: false, error: "Name not updated"}
    }

    const additionalUpdate = await db
        .update(user)
        .set({
            additionalInfo: {
                address,
                businessName,
                details
            }
        }).where((eq(user.id, session.user.id)))
        .returning()

    if (!additionalUpdate) return {success: false, error: "Additional details not updated"}

    return {success: true, error: false}
}