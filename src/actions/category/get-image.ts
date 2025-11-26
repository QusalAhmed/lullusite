'use server'

// db
import { eq } from 'drizzle-orm'
import db from '@/lib/drizzle-agent'
import { imageTable } from "@/db/image.schema";

async function getImage(data: { hash: string }) {
    return db.query.imageTable.findMany({
        columns: {
            id: true,
            thumbnailUrl: true,
        },
        where: eq(imageTable.hash, data.hash),
        limit: 1,
    })
}

export default getImage;
