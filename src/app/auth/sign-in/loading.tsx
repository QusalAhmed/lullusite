import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

const SignInLoading = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-lg">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <Skeleton className="h-4 w-64 mx-auto" />
                    <Skeleton className="h-8 w-48 mx-auto" />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Remember me / Forgot password row */}
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-28" />
                    </div>

                    {/* Submit Button */}
                    <Skeleton className="h-11 w-full" />
                </div>

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
                <div className="text-center space-y-2">
                    <Skeleton className="h-4 w-56 mx-auto" />
                    <Skeleton className="h-8 w-48 mx-auto" />
                </div>
            </div>
        </div>
    )
}

export default SignInLoading
