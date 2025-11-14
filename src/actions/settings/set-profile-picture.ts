'use server';

import db from '@/lib/drizzle-agent';
import { user, imageTable } from '@/db/index.schema';
import { eq } from 'drizzle-orm';

// Auth
import getSession from '@/lib/get-session';

export default async function setProfilePicture(imageId: string) {
    const session = await getSession();

    // Get image
    const image = await db
        .query
        .imageTable
        .findFirst({
            where: eq(imageTable.id, imageId),
        });

    if (!image) {
        throw new Error('Image not found');
    }

    return db.update(user)
        .set({image: image.thumbnailUrl})
        .where(eq(user.id, session.user.id))
        .returning();
}