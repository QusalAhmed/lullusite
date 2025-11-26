'use client';

import React, { useState, useCallback } from "react";

// ShadCN
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Local
import UpdateCategoryForm from './category-update-form'

// Icon
import { Pencil } from "lucide-react";
import type { ReadyImage } from "@/types/image-hub";

export default function UpdateCategoryDialog(
    {
        name, description, image, categoryId
    }: {
        name: string,
        description: string,
        image?: ReadyImage,
        categoryId: string,
    }
) {
    const [isOpen, setIsOpen] = useState(false);

    const closeDialog = useCallback(()=> {
        setIsOpen(false);
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Pencil size={16} className={'cursor-pointer'}/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] px-0 md:px-6">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        New category description.
                    </DialogDescription>
                </DialogHeader>

                {/* Scroll only the dialog body so header/footer remain visible */}
                <ScrollArea className="max-h-[60vh] mt-2">
                    <UpdateCategoryForm
                        name={name}
                        image={image}
                        description={description}
                        categoryId={categoryId}
                        closeDialogAction={closeDialog}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
