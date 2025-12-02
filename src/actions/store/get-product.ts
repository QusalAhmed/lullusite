'use server';

// db
import db from "@/lib/drizzle-agent";
import { eq } from "drizzle-orm";
import { productTable } from "@/db/product.schema";


export default async function getProduct(productId: string) {
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
                                url: true,
                                altText: true,
                            },
                        },
                    },
                },
                variations: {
                    columns: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        stock: true,
                        weight: true,
                    },
                    with: {
                        images: {
                            columns: {
                                image: true,
                            },
                            with: {
                                image: {
                                    columns: {
                                        id: true,
                                        thumbnailUrl: true,
                                        url: true,
                                        altText: true,
                                    },
                                },
                            },
                        },
                    },
                }
            },
            where: eq(productTable.id, productId)
        })
}

export type ProductType = Awaited<ReturnType<typeof getProduct>>; // may be undefined if not found
export type VariationType = NonNullable<ProductType>['variations'][number];