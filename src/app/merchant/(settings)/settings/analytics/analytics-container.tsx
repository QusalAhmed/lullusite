import React from 'react';

// DB
import db from "@/lib/drizzle-agent";
import { eq } from "drizzle-orm";
import { analyticsTable } from "@/db/index.schema";

// Auth
import getSession from "@/lib/get-session";

// Component
import AnalyticsForm from "./analytics-form";

async function getAnalyticsData() {
    const session = await getSession();
    if (!session) return null;

    const analytics = await db
        .select()
        .from(analyticsTable)
        .where(eq(analyticsTable.userId, session.user.id))
        .limit(1);

    if (analytics.length === 0) return null;

    return analytics[0];
}

async function AnalyticsContainer() {
    const analyticsData = await getAnalyticsData();

    return (
        <div className="p-6 rounded-lg border bg-card">
            <AnalyticsForm analyticsData={analyticsData} />
        </div>
    );
}

export default AnalyticsContainer;

