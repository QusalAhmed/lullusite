'use client';

import React from 'react';
import Link from 'next/link';

// Local
import ThemeToggle from "@/components/theme/themeToggle";
import User from "@/components/nav/user";
import ThreeBar from "@/components/nav/three-bar";
import Notification from "@/components/nav/notification";

const Navbar = () => {
    return (
        <nav className="w-full flex items-center justify-between py-2 md:px-4">
            <ThreeBar/>
            <div className={'hidden md:block'}>
                <Link href={'/'} className={'font-semibold text-2xl'}>Lullu Site</Link>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle/>
                <Notification/>
                <User/>
            </div>
        </nav>
    )
}

export default Navbar;