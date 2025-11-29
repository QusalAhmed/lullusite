'use server'

// db
import db from '@/lib/drizzle-agent'
import { imageTable } from "@/db/image.schema";
import { desc, eq, sum, count } from "drizzle-orm"

// Auth
import getSession from "@/lib/get-session";

export default async function getImages(limit: number, offset: number) {
    const session = await getSession()

    return db
        .select()
        .from(imageTable)
        .where(eq(imageTable.userId, session.user.id))
        .limit(limit)
        .offset(offset)
        .orderBy(desc(imageTable.createdAt))
}

export type GetImagesType = Awaited<ReturnType<typeof getImages>>

export const getImagesCount = async () => {
    const session = await getSession()

    const imageCount = await db
        .select({
            sum: count(imageTable.id),
        })
        .from(imageTable)
        .where(eq(imageTable.userId, session.user.id))

    return imageCount[0].sum || 0
}

export const getImageSize = async () => {
    const session = await getSession()

    const sizeQuery = await db
        .select({
            totalSize: sum(imageTable.size),
        })
        .from(imageTable)
        .where(eq(imageTable.userId, session.user.id))

    return sizeQuery[0].totalSize || 0
}