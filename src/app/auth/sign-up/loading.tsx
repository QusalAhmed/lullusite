import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SignUpLoading = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-lg">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <Skeleton className="h-8 w-56 mx-auto" />
                    <Skeleton className="h-4 w-72 mx-auto" />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>

                {/* Submit Button */}
                <Skeleton className="h-11 w-full" />

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <Skeleton className="h-px w-full" />
                    </div>
                    <div className="relative flex justify-center">
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Social Buttons */}
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Footer */}
                <div className="text-center">
                    <Skeleton className="h-4 w-64 mx-auto" />
                </div>
            </div>
        </div>
    );
};

export default SignUpLoading;

