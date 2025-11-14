import React from 'react';

// Local
import ProfilePicture from './profile-picture';
import UserProfile from './user-profile';

const ProfilePage = () => {
    return (
        <div className={'space-y-8'}>
            <ProfilePicture />
            <UserProfile />
        </div>
    );
};

export default ProfilePage;