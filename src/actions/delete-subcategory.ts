'use server';

import { revalidatePath } from "next/cache";

// Database
import db from "@/lib/drizzle-agent";
import {eq, and} from "drizzle-orm";
import { subCategoriesTable } from "@/db/category.schema";

// Auth
import getSession from "@/lib/get-session";

export default async function deleteSubcategory(subcategoryId: string) {
    const session = await getSession();

    // Delete subcategory from database
    const deletedResponse = await db
        .delete(subCategoriesTable)
        .where(and(
            eq(subCategoriesTable.id, subcategoryId),
            eq(subCategoriesTable.userId, session.user.id)
        )).returning();

    if (deletedResponse.length === 0) {
        throw new Error("Subcategory not found or you do not have permission to delete it.");
    }

    // Revalidate the category page to reflect changes
    revalidatePath('/merchant/category');
}