'use server';

// db
import db from "@/lib/drizzle-agent";
import { eq, and } from "drizzle-orm";
import { productTable } from "@/db/product.schema";

// Auth
import getSession from "@/lib/get-session";

export default async function getProduct(productId: string) {
    const session = await getSession();

    return db
        .query
        .productTable
        .findFirst({
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
            where: and(
                eq(productTable.merchantId, session.user.id),
                eq(productTable.id, productId)
            ),
        })
}

// Export type
export type ProductType = Awaited<ReturnType<typeof getProduct>>;