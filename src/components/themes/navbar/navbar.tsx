'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Local
import MobileNavbar from '../variation-details/mobile-navbar';
import DesktopNavbar from '../variation-details/desktop-navbar';

const Navbar = ({storeSlug}: {storeSlug: string}) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <MobileNavbar storeSlug={storeSlug}/>
    }

    return <DesktopNavbar/>
};

export default Navbar;