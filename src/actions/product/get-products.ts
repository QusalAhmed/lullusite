'use server';

// db
import db from "@/lib/drizzle-agent";
import {eq} from "drizzle-orm";
import {productTable} from "@/db/product.schema";

// Auth
import getSession from "@/lib/get-session";

export default async function getProducts(limit: number = 10) {
    const session = await getSession();

    return db
        .query
        .productTable
        .findMany({
            columns:{
                name: true,
            },
            with: {
                images: true,
                variations: {
                    with: {
                        // image: true,
                    },
                }
            },
            where: eq(productTable.merchantId, session.user.id),
            limit: limit,
        })
}