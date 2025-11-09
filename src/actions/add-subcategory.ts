'use server';

import { revalidatePath } from "next/cache";

// Zod Schema
import subcategorySchema from "@/lib/zod/subcategory.schema";

// Zod
import z from 'zod';

// Database
import db from "@/lib/drizzle-agent";
import { subCategoriesTable } from "@/db/category.schema";

// Auth
import getSession from "@/lib/get-session";

export default async function addSubCategory({data}: { data: z.infer<typeof subcategorySchema> }) {
    const {category, name, description} = z.parse(subcategorySchema, data);
    console.log({category, name, description});
    const session = await getSession();

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