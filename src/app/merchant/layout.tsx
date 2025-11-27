import { cookies } from "next/headers"
import React, { Suspense } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "User dashboard",
}

// Local
import Navbar from "@/components/nav/navbar"
import Loading from "./loading"

// ShadCN
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"

export default async function Layout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar/>
            <SidebarInset>
                <header className="w-full sticky top-0 z-50 bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Navbar/>
                    </div>
                </header>
                <Suspense fallback={<Loading/>}>
                    <div className={'p-4'}>{children}</div>
                </Suspense>
            </SidebarInset>
        </SidebarProvider>
    )
}