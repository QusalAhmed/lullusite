import React from 'react';

// Local
import SignUpForm from '@/components/auth/sign-up-form';

const AuthPage = () => {
    return (
        <div className={'flex min-h-screen items-center justify-center bg-gray-100 p-4'}>
            <SignUpForm />
        </div>
    );
};

export default AuthPage;