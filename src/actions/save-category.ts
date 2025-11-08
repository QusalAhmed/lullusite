'use server'

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { categoryFormSchema } from "@/lib/zod/category.schema";
import { eq, and } from "drizzle-orm";
import db from "@/lib/drizzle-agent";
import { categoriesTable } from "@/db/index.schema";
import getSession from "@/lib/get-session";

export default async function saveCategory(data: z.infer<typeof categoryFormSchema>) {
    const { name, description, image } = data;
    const session = await getSession();

    if (!session?.user?.id) throw new Error("User not authenticated");

    // Check if category already exists
    const existingCategory = await db
        .query
        .categoriesTable
        .findFirst({
            where: and(
                eq(categoriesTable.name, name),
                eq(categoriesTable.userId, session.user.id)
            )
        });

    if (existingCategory) {
        return { error: "Category with this name already exists." };
    }

    // Insert new category
    const insertionData = await db
        .insert(categoriesTable)
        .values({
            name: name.split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
            description: description || null,
            image: image || null,
            userId: session.user.id,
        })
        .returning();

    // Revalidate cache after insert
    revalidatePath("/merchant/category");

    return { error: null, data: insertionData };
}