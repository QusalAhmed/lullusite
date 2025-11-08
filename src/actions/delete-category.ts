'use server'

import { revalidatePath } from 'next/cache'

// db
import db from '@/lib/drizzle-agent'
import { categoriesTable } from '@/db/category.schema'
import { eq, and } from 'drizzle-orm'

// Auth
import getSession from '@/lib/get-session'

export default async function deleteCategory(categoryId: string) {
    console.log('Deleting category with ID:', categoryId)
    const session = await getSession();

    const data = await db
        .delete(categoriesTable)
        .where(
            and(
                eq(categoriesTable.id, categoryId),
                eq(categoriesTable.userId, session.user.id)
            )
        )
        .returning();

    console.log('Delete result:', data)

    // Revalidate the category page to reflect the deletion
    revalidatePath('/merchant/category')

    return data[0];
}