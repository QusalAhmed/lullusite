import React, { Suspense } from 'react';
import localFont from 'next/font/local'

// Analytics
import FacebookPixel from '@/components/analytics/facebook-pixel';
import ClaritySetup from '@/components/analytics/clarity-setup';

// Fonts
const AdorNoirrit = localFont({
    src: '../../../public/fonts/Li Ador Noirrit Regular.ttf',
    display: 'swap',
});

const StoreLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className={AdorNoirrit.className}>
            <Suspense fallback={<div>Loading Analytics...</div>}>
                <FacebookPixel pixelId={'1234708877758735'}/>
                <ClaritySetup projectId={'t2ddqcy0gs'}/>
            </Suspense>
            {children}
        </div>
    );
};

export default StoreLayout;