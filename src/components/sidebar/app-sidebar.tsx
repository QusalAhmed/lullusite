"use client"

import React from "react"
import Link from "next/link"

// Icon
import {
    ShoppingBag,
    Package,
    GalleryVerticalEnd,
    Settings2,
    SquareTerminal,
    Store
} from "lucide-react"


// ShadCN
import { NavMain } from "@/components/sidebar/nav-main"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Font
import { Coiny } from 'next/font/google'

const coiny = Coiny({
    subsets: ['latin'], // required
    weight: ['400'],    // Coiny only has one weight
})


// This is sample data.
const data = {
    navMain: [
        {
            title: "Playground",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Dashboard",
                    url: "dashboard",
                },
                {
                    title: "Customers",
                    url: "#",
                },
                {
                    title: "Analytics",
                    url: "#",
                }
            ],
        },
        {
            title: "Product",
            icon: Package,
            items: [
                {
                    title: "Manage Product",
                    url: "#",
                },
                {
                    title: "Add Product",
                    url: "#",
                },
                {
                    title: "Category Management",
                    url: "category",
                },
            ],
        },
        {
            title: "Order",
            icon: ShoppingBag,
            items: [
                {
                    title: "All Orders",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Store",
            icon: Store,
            items: [
                {
                    title: "Manage Stores",
                    url: "#",
                },
                {
                    title: "Add Landing Page",
                    url: "#",
                }
            ],
        },
        {
            title: "Settings",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Courier",
                    url: "#",
                },
                {
                    title: "User & Permission",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ]
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/merchant/dashboard" className="flex items-center gap-3">
                                <div
                                    className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4"/>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className={coiny.className + " font-normal text-lg p-0 m-0"}>
                                        User Panel
                                    </span>
                                    <span className="text-gray-300">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
