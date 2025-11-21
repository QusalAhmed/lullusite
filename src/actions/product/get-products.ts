'use server';

// db
import db from "@/lib/drizzle-agent";
import { eq } from "drizzle-orm";
import { productTable } from "@/db/product.schema";

// Auth
import getSession from "@/lib/get-session";

export default async function getProducts(limit: number = 10) {
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
                    columns: {
                        image: true,
                    }
                },
                variations: {
                    columns: {
                        id: true,
                        name: true,
                        sku: true,
                        price: true,
                    },
                    with: {
                        image: {
                            columns: {
                                productVariationId: true,
                                image: true,
                            }
                        },
                    },
                }
            },
            where: eq(productTable.merchantId, session.user.id),
            limit: limit,
        })
}