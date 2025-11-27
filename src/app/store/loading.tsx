import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const StoreLoading = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section Skeleton */}
            <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <Skeleton className="h-16 w-[600px] mx-auto mb-6" />
                    <Skeleton className="h-6 w-[500px] mx-auto mb-4" />
                    <Skeleton className="h-6 w-[400px] mx-auto mb-8" />
                    <div className="flex gap-4 justify-center">
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-12 w-40" />
                    </div>
                </div>
            </section>

            {/* Categories Section Skeleton */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <Skeleton className="h-10 w-[300px] mx-auto mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="rounded-lg border bg-card p-8 text-center">
                                <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
                                <Skeleton className="h-5 w-24 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section Skeleton */}
            <section className="py-16 px-4 bg-muted/50">
                <div className="max-w-7xl mx-auto">
                    <Skeleton className="h-10 w-[300px] mx-auto mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="rounded-lg border bg-card overflow-hidden">
                                <Skeleton className="aspect-square w-full" />
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="flex items-center justify-between pt-2">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-9 w-28" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotional Banner Skeleton */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 p-12 text-center">
                        <Skeleton className="h-10 w-[300px] mx-auto mb-4" />
                        <Skeleton className="h-6 w-[400px] mx-auto mb-6" />
                        <Skeleton className="h-12 w-40 mx-auto" />
                    </div>
                </div>
            </section>

            {/* Newsletter Section Skeleton */}
            <section className="py-16 px-4 border-t">
                <div className="max-w-3xl mx-auto text-center">
                    <Skeleton className="h-8 w-[200px] mx-auto mb-4" />
                    <Skeleton className="h-5 w-[350px] mx-auto mb-6" />
                    <div className="flex gap-2 max-w-md mx-auto">
                        <Skeleton className="flex-1 h-11" />
                        <Skeleton className="h-11 w-32" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StoreLoading;

