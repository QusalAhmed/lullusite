import React, {ReactNode} from 'react';

// Local
import Navbar from '@/components/themes/navbar/navbar'

const ThemeLayout = async (
    {children, params}: {children: ReactNode, params: Promise<{ storeSlug: string }>}
) => {
    const {storeSlug} = await params

    return (
        <>
            {children}
            <div className='h-24'/>
            <Navbar storeSlug={storeSlug} />
        </>
    );
};

export default ThemeLayout;