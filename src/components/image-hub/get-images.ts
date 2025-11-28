'use server'

// db
import db from '@/lib/drizzle-agent'
import { imageTable } from "@/db/image.schema";
import { eq, desc } from "drizzle-orm"

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