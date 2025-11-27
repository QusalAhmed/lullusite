import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const EditProductLoading = () => {
    return (
        <>
            <div className="flex flex-col mb-5">
                <Skeleton className="h-9 w-48 mx-auto mb-2" />
                <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>

            {/* Product Form Skeleton */}
            <div className="space-y-6 max-w-5xl mx-auto p-6">
                {/* Image Upload Section */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-32 w-full" />
                </div>

                {/* Category and Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* SKU and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Variations Section */}
                <div className="space-y-4 rounded-lg border p-4">
                    <Skeleton className="h-6 w-32" />
                    {[1, 2].map((i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    ))}
                    <Skeleton className="h-10 w-40" />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-6">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </>
    );
};

export default EditProductLoading;

