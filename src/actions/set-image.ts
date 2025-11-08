'use server'

import db from '@/lib/drizzle-agent'
import { imageTable } from '@/db/index.schema'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function setImage(data: {
    url: string;
    thumbnailUrl: string;
    name: string;
    width: number;
    height: number;
    size: number;
    hash: string;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error('User not authenticated');

    return db.insert(imageTable).values({
        userId: session.user.id,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl,
        altText: data.name,
        width: data.width,
        height: data.height,
        size: data.size,
        hash: data.hash,
    }).returning({
        image_id: imageTable.id
    });
}
