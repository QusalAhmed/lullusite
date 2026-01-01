"use server"

// db
import db from '@/lib/drizzle-agent'
import { eq, and, ilike, or } from 'drizzle-orm'
import { productTable, productVariationTable } from '@/db/index.schema'

// Auth
import getSession from '@/lib/get-session'

type GetItemsParams = {
    searchText?: string
}

const getItems = async (params: GetItemsParams = {}) => {
    const session = await getSession()
    const searchText = (params.searchText ?? '').trim()

    return db
        .query
        .productTable
        .findMany({
            where: and(
                eq(productTable.merchantId, session.user.id),
                // Only apply search when the user actually typed something.
                searchText.length
                    ? or(
                        ilike(productTable.name, `%${searchText}%`),
                        ilike(productTable.sellerSku, `%${searchText}%`),
                    )
                    : undefined,
            ),
            with: {
                variations: {
                    with: {
                        images: {
                            with: {
                                image: {
                                    columns: {
                                        thumbnailUrl: true,
                                    }
                                }
                            }
                        }
                    },
                    columns: {
                        id: true,
                        name: true,
                        sku: true,
                        price: true,
                        stock: true,
                    },
                    where: eq(productVariationTable.isActive, true),
                },
            },
            columns: {
                id: true,
                name: true,
            },
        })
}

export default getItems
export type GetItemsReturnType = Awaited<ReturnType<typeof getItems>>[number]
