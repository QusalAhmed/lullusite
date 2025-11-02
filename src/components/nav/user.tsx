'use client'

import React from 'react';
import Link from 'next/link';

// Auth
import { authClient } from "@/lib/auth-client"

// ShadCN
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// ShadCN
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const User = () => {
    const {
        data: session,
        isPending, //loading state
        refetch, //refetch the session
    } = authClient.useSession()

    async function handleSignOut() {
        try {
            // sign out via auth client; call without destructuring to avoid unused variable warnings
            await authClient.signOut()
            // refetch the session state
            if (typeof refetch === 'function') {
                refetch()
            }
        } catch (err) {
            console.error('Error signing out:', err)
        }
    }

    // Render loading / unauthenticated / authenticated states
    if (isPending) {
        return (
            <div>
                <Button size="sm" variant="ghost" disabled>
                    Loading...
                </Button>
            </div>
        )
    }

    if (!session || !session.user) {
        return (
            <Link href="/auth/sign-in">
                <Button size="sm" variant="outline">Sign In</Button>
            </Link>
        )
    }

    const user = session.user as { name?: string; email?: string; image?: string }
    const name = user?.name || user?.email || 'User'
    const email = user?.email || ''
    const image = user?.image || ''

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar>
                        {image ? (
                            <AvatarImage src={image} alt={name}/>
                        ) : (
                            <AvatarFallback>{(name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                        )}
                    </Avatar>
                    <span className="hidden sm:inline">{name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                    <div className="flex flex-col">
                        <span className="font-medium truncate">{name}</span>
                        {email && <span className="text-xs text-muted-foreground truncate">{email}</span>}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    handleSignOut().then();
                }}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default User;