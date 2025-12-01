import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PageLoading = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Header Skeleton */}
            <div className="border-b bg-card px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-40 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar Skeleton */}
                <aside className="w-64 border-r bg-card overflow-y-auto">
                    <div className="p-4">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            {/* Component Categories */}
                            {[1, 2, 3].map((category) => (
                                <div key={category} className="space-y-2">
                                    <Skeleton className="h-4 w-20 mb-2" />
                                    {[1, 2, 3, 4].map((item) => (
                                        <Skeleton key={item} className="h-9 w-full rounded-md" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Canvas Skeleton */}
                <main className="flex-1 overflow-y-auto bg-muted/30">
                    <div className="p-8">
                        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border min-h-[800px] p-8">
                            <div className="flex flex-col items-center justify-center h-full py-20">
                                <Skeleton className="h-24 w-24 rounded-lg mb-6" />
                                <Skeleton className="h-8 w-64 mb-2" />
                                <Skeleton className="h-5 w-96 mb-2" />
                                <Skeleton className="h-5 w-80 mb-6" />
                                <Skeleton className="h-12 w-48" />
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar Skeleton */}
                <aside className="w-72 border-l bg-card overflow-y-auto">
                    <div className="p-4">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PageLoading;

