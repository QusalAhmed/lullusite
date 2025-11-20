'use server';

import { revalidatePath } from "next/cache";

// Zod Schema
import subcategorySchema from "@/lib/validations/subcategory.schema";

// Zod
import z from 'zod';

// Database
import db from "@/lib/drizzle-agent";
import {eq, and} from "drizzle-orm";
import { subCategoriesTable } from "@/db/category.schema";

// Auth
import getSession from "@/lib/get-session";

export default async function addSubCategory({data}: { data: z.infer<typeof subcategorySchema> }) {
    const {category, name, description} = z.parse(subcategorySchema, data);
    console.log({category, name, description});
    const session = await getSession();

    const categoryExists = await db
        .query
        .subCategoriesTable
        .findFirst({
            where: and(
                eq(subCategoriesTable.categoryId, category),
                eq(subCategoriesTable.userId, session?.user.id || ''),
                eq(subCategoriesTable.name, name)
            )
        })
    if (categoryExists) {
        return {
            success: false,
            error: 'Subcategory with this name already exists in the selected category.',
        };
    }

    const insertionData = await db
        .insert(subCategoriesTable)
        .values({
            categoryId: category,
            userId: session.user.id,
            name,
            description: description || null,
        })
        .returning();
    revalidatePath('/merchant/category');
    return {
        success: true,
        data: insertionData,
    };
}