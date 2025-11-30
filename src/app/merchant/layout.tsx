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

// Providers
import { ReactQueryProvider } from "./providers";
import { ReduxProvider } from "./StoreProvider";

export default async function Layout({children}: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <ReduxProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar/>
                <SidebarInset>
                    <AutoHideHeader/>
                    <Suspense fallback={<Loading/>}>
                        <div className={'p-4'}>
                            <ReactQueryProvider>{children}</ReactQueryProvider>
                        </div>
                    </Suspense>
                </SidebarInset>
            </SidebarProvider>
        </ReduxProvider>
    )
}