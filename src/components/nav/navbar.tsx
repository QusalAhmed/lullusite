'use client';

import React from 'react';
import Link from 'next/link';
import Image from "next/image";

// Local
import ThemeToggle from "@/components/next-theme/themeToggle";
import User from "@/components/nav/user";
// import ThreeBar from "@/components/nav/three-bar";
import Notification from "@/components/nav/notification";
import BugReport from "@/components/nav/bug-report";

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
                        preload={true}
                    />
                </Link>
            </div>
            <div className="flex items-center justify-between gap-4">
                <BugReport/>
                <ThemeToggle/>
                <Notification/>
                <User/>
            </div>
        </nav>
    )
}

export default Navbar;