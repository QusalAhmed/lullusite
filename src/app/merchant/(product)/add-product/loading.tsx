import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AddProductLoading = () => {
    return (
        <>
            <div className="flex flex-col m-5">
                <Skeleton className="h-8 w-56 mx-auto mb-3" />
                <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-4 w-80" />
                </div>
            </div>

            {/* Product Form Skeleton */}
            <div className="space-y-6 max-w-5xl mx-auto p-6">
                {/* Image Upload Section */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-64 mb-4" />
                    <div className="border-2 border-dashed rounded-lg p-12">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-32 w-full" />
                </div>

                {/* Category and Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* SKU */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full md:w-1/2" />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Video Link */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Variations Section */}
                <div className="space-y-4 rounded-lg border p-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-9 w-9 rounded" />
                    </div>
                    <Skeleton className="h-4 w-full max-w-2xl" />

                    {/* Variation Item Skeleton */}
                    <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/30">
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
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </div>

                    <Skeleton className="h-10 w-44" />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-6 border-t">
                    <Skeleton className="h-11 w-28" />
                    <Skeleton className="h-11 w-36" />
                </div>
            </div>
        </>
    );
};

export default AddProductLoading;

