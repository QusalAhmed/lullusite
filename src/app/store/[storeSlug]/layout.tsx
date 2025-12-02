import React from 'react';
import localFont from 'next/font/local'

// Provider
import QueryProvider from "@/app/store/QueryProvider";

// Fonts
const AdorNoirrit = localFont({
    src: '../../../../public/fonts/Li Ador Noirrit Regular.ttf',
    display: 'swap',
});

const StoreLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className={AdorNoirrit.className}>
            <QueryProvider>
                {children}
            </QueryProvider>
        </div>
    );
};

export default StoreLayout;