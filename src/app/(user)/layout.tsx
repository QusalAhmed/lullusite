import { cookies } from "next/headers"
import React from "react"

// Local
import Navbar from "@/components/nav/navbar"

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
                <header className="w-full sticky top-0">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Navbar/>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 aspect-video rounded-xl"/>
                        <div className="bg-muted/50 aspect-video rounded-xl"/>
                        <div className="bg-muted/50 aspect-video rounded-xl"/>
                    </div>
                    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"/>
                </div>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}