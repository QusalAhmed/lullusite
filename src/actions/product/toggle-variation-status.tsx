'use server';

import db from '@/lib/drizzle-agent';
import { eq, and } from 'drizzle-orm';
import { productVariationTable, productTable } from '@/db/index.schema';
import getSession from '@/lib/get-session';

export default async function toggleVariationStatus(id: string, isActive: boolean) {
    const userId = (await getSession()).user.id;

    const [updated] = await db
        .update(productVariationTable)
        .set({ isActive })
        .from(productTable)
        .where(
            and(
                eq(productVariationTable.id, id),
                eq(productVariationTable.productId, productTable.id),
                eq(productTable.merchantId, userId),
            )
        )
        .returning({
            id: productVariationTable.id,
        });

    if (!updated) {
        // Either:
        // - variation does not exist, or
        // - it doesn't belong to this merchant
        throw new Error('Variation not found or unauthorized');
    }

    return { success: true };
}
