'use server';

// Zod Schema
import subcategorySchema from "@/lib/zod/subcategory.schema";

// Zod
import z from 'zod';

// Database
import db from "@/lib/drizzle-agent";
import { eq, and, ne } from "drizzle-orm";
import { subCategoriesTable } from "@/db/category.schema";

// Auth
import getSession from "@/lib/get-session";

// Next.js
import { revalidatePath } from "next/cache";

export default async function updateSubcategory({data}: { data: z.infer<typeof subcategorySchema> & { id: string } }) {
    const {id, category, name, description} = z.parse(subcategorySchema.extend({
        id: z.string(),
    }), data);
    console.log({id, category, name, description});
    const session = await getSession();

    // Check if subcategory exists
    const subcategory = await db
        .query
        .subCategoriesTable
        .findFirst({
            where: and(
                eq(subCategoriesTable.id, id),
                eq(subCategoriesTable.userId, session.user.id)
            )
        });
    if (!subcategory) {
        return {
            success: false,
            error: 'Subcategory not found.',
        };
    }

    // Check whether subcategory with the same name exists in the selected category
    const subcategoryExists = await db
        .query
        .subCategoriesTable
        .findFirst({
            where: and(
                ne(subCategoriesTable.id, id),
                eq(subCategoriesTable.categoryId, category),
                eq(subCategoriesTable.name, name),
                eq(subCategoriesTable.userId, session.user.id)
            )
        });
    if (subcategoryExists) {
        return {
            success: false,
            error: 'Subcategory already exists with this name in the selected category.',
        };
    }

    const updateData = await db
        .update(subCategoriesTable)
        .set({
            name,
            description: description || null,
        })
        .where(and(
            eq(subCategoriesTable.id, id),
            eq(subCategoriesTable.userId, session.user.id)
        ))
        .returning();
    revalidatePath('/merchant/category');
    return {
        success: true,
        data: updateData,
    };
}