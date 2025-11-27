import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardLoading = () => {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Header Section Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-9 w-[200px]" />
                <Skeleton className="h-5 w-[400px]" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-32" />
                            </div>
                            <Skeleton className="h-12 w-12 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-36 mt-3" />
                    </div>
                ))}
            </div>

            {/* Charts Section Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Chart */}
                <div className="rounded-lg border bg-card col-span-4 p-6 shadow-sm">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-[300px] w-full rounded-md" />
                </div>

                {/* Recent Sales */}
                <div className="rounded-lg border bg-card col-span-3 p-6 shadow-sm">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-40" />
                                </div>
                                <Skeleton className="h-5 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Skeleton */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <Skeleton className="h-6 w-36 mb-4" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-60" />
                            </div>
                            <Skeleton className="h-3 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardLoading;