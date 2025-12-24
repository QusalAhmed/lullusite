'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Local
import MobileNavbar from '../variation-details/mobile-navbar';
import DesktopNavbar from '../variation-details/desktop-navbar';

const Navbar = ({storeSlug}: {storeSlug: string}) => {
    const isMobile = useIsMobile();

    if (isMobile === undefined) {
        return null; // or a loading spinner
    }

    if (isMobile) {
        return <MobileNavbar storeSlug={storeSlug}/>
    } else {
        return <DesktopNavbar storeSlug={storeSlug}/>;
    }
};

export default Navbar;