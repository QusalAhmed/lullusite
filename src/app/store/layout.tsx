import React from 'react';
import localFont from 'next/font/local'

// Provider
import QueryProvider from "@/app/store/QueryProvider";

// Analytics
import FacebookPixel from '@/components/analytics/facebook-pixel';

// Fonts
const AdorNoirrit = localFont({
    src: '../../../public/fonts/Li Ador Noirrit Regular.ttf',
    display: 'swap',
});

const StoreLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className={AdorNoirrit.className}>
            <FacebookPixel pixelId={'1234708877758735'} />
            <QueryProvider>
                {children}
            </QueryProvider>
        </div>
    );
};

export default StoreLayout;