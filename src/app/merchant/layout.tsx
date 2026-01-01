import { cookies } from "next/headers"
import React, { Suspense } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "User dashboard",
}

// Local
import AutoHideHeader from "@/components/nav/auto-hide-header"
import Loading from "./loading"

// ShadCN
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"

export default async function Layout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar/>
            <SidebarInset>
                <AutoHideHeader/>
                <Suspense fallback={<Loading/>}>
                    <div className={'p-4'}>
                        {children}
                    </div>
                </Suspense>
            </SidebarInset>
        </SidebarProvider>
    )
}