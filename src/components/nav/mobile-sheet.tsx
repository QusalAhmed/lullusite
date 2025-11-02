import React from "react"

// ShadCN
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function MobileSheet(
    {setIsOpen, children}: {
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
        children: React.ReactNode
    }
) {
    return (
        <Sheet onOpenChange={() => {
            setIsOpen((open: boolean) => !open)
        }}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                    Login
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
