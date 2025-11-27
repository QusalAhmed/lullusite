import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductsLoading = () => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-36" />
            </div>

            {/* Product Table Skeleton */}
            <div className="overflow-hidden rounded-md border">
                <div className="p-4 border-b bg-muted/50">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                <div className="divide-y">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-16 w-16 rounded-md" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-8 w-8 rounded" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between p-4 border-t">
                    <Skeleton className="h-4 w-40" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsLoading;

