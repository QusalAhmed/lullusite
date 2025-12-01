'use server'

// db
import db from '@/lib/drizzle-agent'
import {eq, desc} from 'drizzle-orm'
import {pageTable} from '@/db/page.schema'

// auth
import getSession from '@/lib/get-session'


export default async function updatePage() {
    const session = await getSession()

    return db
        .select()
        .from(pageTable)
        .where(eq(pageTable.userId, session.user.id))
        .orderBy(desc(pageTable.createdAt))
}