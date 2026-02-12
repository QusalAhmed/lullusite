import React, { ReactNode } from 'react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tracking',
    description: 'Track your order here',
}

const Layout = ({children}: { children: ReactNode }) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default Layout;