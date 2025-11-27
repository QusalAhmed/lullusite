import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Local
import ProfilePicture from './profile-picture';
import UserProfile from './user-profile';

// Loading skeleton for profile picture section
function ProfilePictureLoading() {
    return (
        <div className="space-y-3 mt-4">
            <div className="flex items-center justify-center">
                <div className="border-dashed border-2 border-gray-300 rounded-full p-2">
                    <Skeleton className="w-48 h-48 rounded-full" />
                </div>
            </div>
        </div>
    );
}

// Loading skeleton for user profile form
function UserProfileLoading() {
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

const ProfilePage = () => {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and profile information
                </p>
            </div>

            <Suspense fallback={<ProfilePictureLoading />}>
                <ProfilePicture />
            </Suspense>

            <Suspense fallback={<UserProfileLoading />}>
                <UserProfile />
            </Suspense>
        </div>
    );
};

export default ProfilePage;