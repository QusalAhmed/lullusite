import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PublicStoreLoading = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Store Header/Banner Skeleton */}
            <section className="relative bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-start gap-6">
                        <Skeleton className="h-32 w-32 rounded-lg" />
                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-6 w-96" />
                            <div className="flex gap-4">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Skeleton */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Filters Sidebar Skeleton */}
                    <aside className="w-64 flex-shrink-0">
                        <div className="space-y-6">
                            {[1, 2, 3].map((section) => (
                                <div key={section} className="rounded-lg border bg-card p-4">
                                    <Skeleton className="h-5 w-24 mb-3" />
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4, 5].map((item) => (
                                            <Skeleton key={item} className="h-9 w-full" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Products Grid Skeleton */}
                    <main className="flex-1">
                        {/* Toolbar Skeleton */}
                        <div className="flex items-center justify-between mb-6">
                            <Skeleton className="h-5 w-48" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-40" />
                                <div className="flex gap-1">
                                    <Skeleton className="h-10 w-10" />
                                    <Skeleton className="h-10 w-10" />
                                </div>
                            </div>
                        </div>

                        {/* Products Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({length: 12}).map((_, i) => (
                                <div key={i} className="rounded-lg border bg-card overflow-hidden">
                                    <Skeleton className="aspect-square w-full" />
                                    <div className="p-4 space-y-3">
                                        <Skeleton className="h-5 w-full" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="space-y-1">
                                                <Skeleton className="h-6 w-20" />
                                            </div>
                                            <Skeleton className="h-10 w-10 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Skeleton */}
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Skeleton className="h-10 w-24" />
                            {[1, 2, 3, 4, 5].map((page) => (
                                <Skeleton key={page} className="h-10 w-10" />
                            ))}
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PublicStoreLoading;

