'use client';
import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import deleteCategory from "@/actions/category/delete-category";

// Sonner
import { toast } from "sonner";

const ConfirmDelete = ({categoryId}: {categoryId: string}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer">
                <Trash size={16}/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the category and remove
                        all its data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        deleteCategory(categoryId).then((res) => {
                            toast.success(`Category ${res.name} deleted successfully.`);
                        });
                    }}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmDelete;