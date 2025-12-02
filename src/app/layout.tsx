import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Sonner
import { Toaster } from 'sonner'

// Local
import { ThemeProvider } from "@/components/next-theme/theme-provider";

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

// Providers
import { ReduxProvider } from "./StoreProvider";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ReduxProvider>
                <Toaster position="top-right" richColors closeButton expand={false}/>
                {children}
            </ReduxProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
