'use server'

// Drizzle DB
import db from "@/lib/drizzle-agent"
import { categoriesTable } from "@/db/index.schema"
import { eq, asc } from "drizzle-orm";

// Auth
import getSession from "@/lib/get-session"

async function getCategory() {
    const session = await getSession();

    return db
        .query
        .categoriesTable
        .findMany({
            with: {
                image: true,
                subCategories: {
                    orderBy: [asc(categoriesTable.name)],
                }
            },
            orderBy: [asc(categoriesTable.name)],
            where: eq(categoriesTable.userId, session.user.id)
        });
}

export default getCategory;