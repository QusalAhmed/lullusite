'use server'

import { cache } from 'react'

// db
import db from '@/lib/drizzle-agent'
import { eq } from 'drizzle-orm'
import { pageTable } from '@/db/page.schema'


const updatePage = async (slug: string) => {
    return db
        .select()
        .from(pageTable)
        .where(eq(pageTable.slug, slug))
        .limit(1)
        .then(res => res[0])
}

export default cache(updatePage)