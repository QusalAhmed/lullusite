'use server'

// db
import db from '@/lib/drizzle-agent'
import { eq, and } from 'drizzle-orm'
import { pageTable } from '@/db/page.schema'

// auth
import getSession from '@/lib/get-session'


export default async function updatePage(pageId: string) {
    const session = await getSession()

    return db
        .select()
        .from(pageTable)
        .where(and(
            eq(pageTable.id, pageId),
            eq(pageTable.userId, session.user.id)
        ))
        .limit(1)
        .then(res => res[0])
}