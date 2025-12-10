'use server'

import { cache } from 'react'

// db
import db from '@/lib/drizzle-agent'
import { eq } from 'drizzle-orm'
import { pageTable } from '@/db/index.schema'


export default cache(async function getUser(storeSlug: string) {
    return db
        .query.pageTable
        .findFirst({
            with: {
                user: {
                    with: {
                        businessInformation: {
                            columns: {
                                businessName: true,
                                address: true,
                                email: true,
                                phone: true,
                                description: true,
                            },
                            with: {
                                logoImage: {
                                    columns: {
                                        url: true,
                                        altText: true,
                                    },
                                },
                            },
                        },
                    },
                }
            },
            where: eq(pageTable.slug, storeSlug),
        })
})