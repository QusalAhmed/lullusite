'use server';

// db
import db from "@/lib/drizzle-agent";
import { eq } from "drizzle-orm";
import { productTable } from "@/db/product.schema";

// Auth
import getSession from "@/lib/get-session";

export default async function getProducts(limit: number = -1, offset: number = 0) {
    const session = await getSession();

    return db
        .query
        .productTable
        .findMany({
            columns: {
                id: true,
                name: true,
                isActive: true,
            },
            with: {
                images: {
                    with: {
                        image: {
                            columns: {
                                id: true,
                                thumbnailUrl: true,
                            },
                        },
                    },
                },
                variations: {
                    columns: {
                        id: true,
                        name: true,
                        sku: true,
                        price: true,
                        stock: true,
                        isActive: true,
                    },
                    with: {
                        images: {
                            with: {
                                image: {
                                    columns: {
                                        id: true,
                                        thumbnailUrl: true,
                                    },
                                },
                            },
                        },
                    },
                }
            },
            where: eq(productTable.merchantId, session.user.id),
            limit: limit,
            orderBy: (productTable, {desc}) => [
                desc(productTable.createdAt),
            ],
            offset: offset,
        })
}

// Export type
export type Products = Awaited<ReturnType<typeof getProducts>>[number];