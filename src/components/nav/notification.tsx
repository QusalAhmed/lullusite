"use client"

import React, { useState } from "react"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Notification() {
    // Track whether the dialog is open and which notification was selected
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<{ title: string; body: string } | null>(null)

    // For now we use static notifications; attach `unread` flag to show badge
    const notifications = [
        { id: 1, title: "New File", body: "You have a new file available to view.", unread: true },
        { id: 2, title: "Share", body: "Someone shared a document with you.", unread: true },
        { id: 3, title: "Download", body: "Your download is ready.", unread: false },
    ]

    // count unread notifications for the badge
    const unreadCount = notifications.filter((n) => (n as any).unread).length

    function openNotification(n: { title: string; body: string }) {
        setSelected(n)
        setOpen(true)
    }

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    {/* Wrap bell so we can position a badge */}
                    <div className="relative inline-flex items-center">
                        <Bell className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span
                                className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] leading-none"
                                style={{ width: 16, height: 16 }}
                                aria-label={`${unreadCount} unread notifications`}
                            >
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        {notifications.map((n) => (
                            <DropdownMenuItem key={n.id} onClick={() => openNotification(n)}>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{n.title}...</span>
                                    <span className="text-xs text-muted-foreground">{n.body}</span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={open} onOpenChange={setOpen}>
                {/* controlled dialog - content is populated from the selected notification */}
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selected?.title ?? "Notification"}</DialogTitle>
                        <DialogDescription>
                            {selected?.body ?? "No details available."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex justify-end">
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
