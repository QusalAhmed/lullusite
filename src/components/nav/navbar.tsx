'use client';

import React from 'react';
import Link from 'next/link';

// Local
import ThemeToggle from "@/components/theme/themeToggle";
import User from "@/components/nav/user";
import ThreeBar from "@/components/nav/three-bar";

const Navbar = () => {
    return (
        <nav className="w-full h-16 flex items-center justify-between px-4">
            <ThreeBar/>
            <Link href={'/'}>Lullu Site</Link>
            <div className="flex items-center gap-4">
                <ThemeToggle/>
                <User/>
            </div>
        </nav>
    )
}

export default Navbar;