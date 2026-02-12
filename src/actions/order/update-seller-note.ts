'use server'

// db
import db from '@/lib/drizzle-agent'
import { eq, and } from 'drizzle-orm'
import { orderTable } from '@/db/index.schema'

// Auth
import getSession from '@/lib/get-session'

export default async function updateSellerNote(
    {orderId, note}: { orderId: string; note: string }
) {
    const merchant = await getSession()

    try {
        await db
            .update(orderTable)
            .set({merchantNote: note})
            .where(and(
                eq(orderTable.id, orderId),
                eq(orderTable.merchantId, merchant.user.id)
            ))

        return {
            success: true,
            message: 'Seller note updated successfully',
        }
    } catch (error) {
        console.error('Error updating seller note:', error)
        return {
            success: false,
            message: 'Failed to update seller note',
        }
    }
}