'use server'

// db
import db from '@/lib/drizzle-agent'
import { eq, inArray, and } from 'drizzle-orm'
import { orderTable } from '@/db/index.schema'

// Auth
import getSession from "@/lib/get-session";

export default async function deleteOrder(orderId: string[]) {
    const session = await getSession();

    const deletionResult = await db
        .delete(orderTable)
        .where(
            and(
                eq(orderTable.merchantId, session.user.id),
                inArray(orderTable.id, orderId)
            )
        ).returning()

    if (deletionResult.length === 0) {
        return {
            success: false,
            message: 'No orders were deleted. Please check the order IDs provided.',
        }
    }

    return{
        success: true,
        message: `${deletionResult.length} order(s) deleted successfully.`,
    };
}