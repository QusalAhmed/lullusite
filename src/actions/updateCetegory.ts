'use server'

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { categoryFormSchema } from "@/lib/zod/category.schema";
import { eq, and } from "drizzle-orm";
import db from "@/lib/drizzle-agent";
import { categoriesTable } from "@/db/index.schema";
import getSession from "@/lib/get-session";

export default async function saveCategory(
    data: z.infer<typeof categoryFormSchema> & { categoryId: string }
) {
    const { name, description, image, categoryId } = data;
    const session = await getSession();

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

    // Update category
    const updateData = await db
        .update(categoriesTable)
        .set({
            name,
            description,
            image: image || null,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(categoriesTable.id, categoryId),
                eq(categoriesTable.userId, session.user.id)
            )
        )
        .returning({ updatedId: categoriesTable.id })

    // Revalidate cache after insert
    revalidatePath("/merchant/category");

    return { error: null, data: updateData };
}