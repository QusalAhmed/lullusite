'use server'

import {revalidatePath} from 'next/cache'

// db
import db from '@/lib/drizzle-agent'
import {pageTable} from '@/db/page.schema'

// auth
import getSession from '@/lib/get-session'

// Validation
import * as z from 'zod'
import {pageFormSchema} from '@/lib/validations/page.schema'

export default async function addPage(data: z.infer<typeof pageFormSchema>) {
    const {title, slug} = await pageFormSchema.parseAsync(data)

    const session = await getSession()

    const newPage = await db
        .insert(pageTable)
        .values({
            title: title,
            slug: slug,
            userId: session.user.id,
        })
        .returning()

    if (newPage){
        revalidatePath('/merchant/landing-pages')
        return {
            success: true,
            message: 'Page added successfully',
        }
    } else {
        return {
            success: false,
            message: 'Failed to add page',
        }
    }
}