import React from 'react';

// Local
import SignInForm from '@/components/auth/sign-in-form';

const AuthPage = () => {
    return (
        <div className={'flex min-h-screen items-center justify-center bg-gray-100 p-4'}>
            <SignInForm />
        </div>
    );
};

export default AuthPage;