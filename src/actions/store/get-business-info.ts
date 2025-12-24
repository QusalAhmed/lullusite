'use server'

// db
import { eq } from 'drizzle-orm'
import db from '@/lib/drizzle-agent'
import { businessInformationTable } from '@/db/index.schema'

// Local
import getMerchant from "@/lib/get-merchant";

export default async function getBusinessInfo() {
    const merchant = await getMerchant()

    if (!merchant.success) {
        new Error('Unable to fetch merchant data')
    }

    return db
        .query
        .businessInformationTable
        .findFirst({
            where: eq(businessInformationTable.userId, merchant.merchantId as string),
            with: {
                logoImage: {
                    columns: {
                        thumbnailUrl: true,
                        altText: true,
                    },
                },
            },
            columns: {
                businessName: true,
                address: true,
                email: true,
                phone: true,
                description: true,
            },
        })
}