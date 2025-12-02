'use server'

import { cache } from 'react'

// db
import db from '@/lib/drizzle-agent'
import { eq, and } from 'drizzle-orm'
import { pageTable } from '@/db/page.schema'

// auth
import getSession from '@/lib/get-session'


const updatePage = async (slug: string) => {
    const session = await getSession()

    return db
        .select()
        .from(pageTable)
        .where(and(
            eq(pageTable.slug, slug),
            eq(pageTable.userId, session.user.id)
        ))
        .limit(1)
        .then(res => res[0])
}

export default cache(updatePage)