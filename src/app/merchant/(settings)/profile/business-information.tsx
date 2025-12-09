import React from 'react';

// DB
import db from "@/lib/drizzle-agent";
import { eq } from "drizzle-orm";
import { businessInformationTable } from "@/db/index.schema";

// Auth
import getSession from "@/lib/get-session";

// Component
import BusinessInformationForm from "./business-information-form";

async function getBusinessInformation() {
    const session = await getSession();
    if (!session) return null;

    const businessInfo = await db
        .select({
            id: businessInformationTable.id,
            businessName: businessInformationTable.businessName,
            address: businessInformationTable.address,
            email: businessInformationTable.email,
            phone: businessInformationTable.phone,
            description: businessInformationTable.description,
            logoImageId: businessInformationTable.logoImageId,
        })
        .from(businessInformationTable)
        .where(eq(businessInformationTable.userId, session.user.id))
        .limit(1);

    if (businessInfo.length === 0) return null;

    // Fetch logo image if exists
    const bizInfo = businessInfo[0];
    if (bizInfo.logoImageId) {
        const logoImage = await db.query.imageTable.findFirst({
            where: (image, { eq }) => eq(image.id, bizInfo.logoImageId!),
            columns: {
                id: true,
                url: true,
                thumbnailUrl: true,
            }
        });

        return {
            ...bizInfo,
            logoImage: logoImage || null,
        };
    }

    return {
        ...bizInfo,
        logoImage: null,
    };
}

async function BusinessInformation() {
    const businessInfo = await getBusinessInformation();

    return (
        <div className="p-6 rounded-lg border bg-card">
            <BusinessInformationForm businessInfo={businessInfo} />
        </div>
    );
}

export default BusinessInformation;

