import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Local
import Navbar from '@/components/themes/navbar/navbar'

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Home",
    description: "Lullu Site | Website builder and business automation",
};


export default async function RootLayout({
                                             children,
                                             params
                                         }: Readonly<{
    children: React.ReactNode; params: Promise<{ storeSlug: string }>;
}>) {
    const {storeSlug} = await params

    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {children}
        <div className='h-24'/>
        <Navbar storeSlug={storeSlug}/>
        </body>
        </html>
    );
}
