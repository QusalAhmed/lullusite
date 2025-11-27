"use client"

import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Navbar from "@/components/nav/navbar"

export default function AutoHideHeader() {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        // Hide header after 1 second
        const hideTimer = setTimeout(() => {
            if (window.scrollY === 0) {
                setIsVisible(false)
            }
        }, 1000)

        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Show header when scrolling up
            if (currentScrollY < lastScrollY) {
                setIsVisible(true)
                clearTimeout(hideTimer)
            } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Hide header when scrolling down (after 50px to avoid flickering)
                setIsVisible(false)
            }

            // Always show header at the top of the page
            if (currentScrollY === 0) {
                setIsVisible(true)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })

        return () => {
            clearTimeout(hideTimer)
            window.removeEventListener("scroll", handleScroll)
        }
    }, [lastScrollY])

    return (
        <header
            className={`w-full sticky top-0 z-50 bg-white dark:bg-gray-900 transition-transform duration-300 ${
                isVisible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Navbar />
            </div>
        </header>
    )
}

