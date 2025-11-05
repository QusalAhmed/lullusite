'use client';

import React from 'react';
import Link from 'next/link';

// Local
import ThemeToggle from "@/components/theme/themeToggle";
import User from "@/components/nav/user";
// import ThreeBar from "@/components/nav/three-bar";
import Notification from "@/components/nav/notification";
import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="w-full flex items-center justify-end py-2 md:px-4 md:justify-between">
            {/*<ThreeBar/>*/}
            <div className={'hidden md:block'}>
                <Link href="/">
                    <Image
                        src='/home/logo.png'
                        width={120}
                        height={50}
                        alt="Float UI logo"
                    />
                </Link>
            </div>
            <div className="flex items-center justify-between gap-4">
                <ThemeToggle/>
                <Notification/>
                <User/>
            </div>
        </nav>
    )
}

export default Navbar;