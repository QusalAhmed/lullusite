import React from 'react';
import Link from 'next/link';

// ShadCN
import { Button } from "@/components/ui/button";

const User = () => {
    return (
        <Button variant="outline">
            <Link href="/auth/sign-in">Login</Link>
        </Button>
    );
};

export default User;