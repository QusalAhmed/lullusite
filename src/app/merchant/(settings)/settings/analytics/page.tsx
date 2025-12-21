import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Local
import AnalyticsContainer from './analytics-container';

// Loading skeleton for analytics form
function FormLoading() {
    return (
        <div className="space-y-6 p-6 rounded-lg border bg-card">
            <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-4 w-3/4 max-w-xl" />
            </div>

            {/* Form fields skeleton */}
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-full max-w-md" />
                </div>
            ))}

            {/* Button skeleton */}
            <Skeleton className="h-10 w-32 mt-6" />
        </div>
    );
}

const AnalyticsPage = () => {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Analytics Settings</h1>
                <p className="text-muted-foreground">
                    Configure your analytics and conversion tracking integrations
                </p>
            </div>

            <Suspense fallback={<FormLoading />}>
                <AnalyticsContainer />
            </Suspense>
        </div>
    );
};

export default AnalyticsPage;