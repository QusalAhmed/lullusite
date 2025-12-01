'use server'

import {revalidatePath} from "next/cache";

// db
import db from '@/lib/drizzle-agent'
import {eq, and} from 'drizzle-orm'
import {pageTable} from '@/db/page.schema'

// auth
import getSession from '@/lib/get-session'

// Validation
import * as z from 'zod'
import {pageFormSchema} from '@/lib/validations/page.schema'

export default async function updatePage(data: z.infer<typeof pageFormSchema>) {
    const {id, title, slug} = await pageFormSchema.parseAsync(data)

    const session = await getSession()

    const updatedPage = await db
        .update(pageTable)
        .set({
            title: title,
            slug: slug,
        })
        .where(and(
            eq(pageTable.id, id),
            eq(pageTable.userId, session.user.id),
        ))
        .returning()

    if (updatedPage){
        revalidatePath('/merchant/landing-pages')
        return {
            success: true,
            message: 'Page updated successfully',
        }
    } else {
        return {
            success: false,
            message: 'Failed to update page',
        }
    }
}