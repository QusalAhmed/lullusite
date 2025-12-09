import React from 'react';

// Local
import UserProfileForm from './user-profile-form';

// Server component
import getUser from '@/lib/get-user';

const UserProfile = async () => {
    const userProfile = await getUser();

    return (
        <div className="p-6 rounded-lg border bg-card">
            <UserProfileForm userProfile={userProfile} />
        </div>
    );
};

export default UserProfile;