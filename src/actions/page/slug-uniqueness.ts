'use server'

// db
import db from '@/lib/drizzle-agent'
import {eq, and} from 'drizzle-orm'
import {pageTable} from '@/db/page.schema'

// auth
import getSession from '@/lib/get-session'

export default async function isStoreSlugUnique(slug: string) {
    const session = await getSession()

    const storeWithSlug = await db
        .select()
        .from(pageTable)
        .where(and(
            eq(pageTable.slug, slug),
            eq(pageTable.userId, session.user.id)
        ))
        .limit(1)

    return storeWithSlug.length === 0
}