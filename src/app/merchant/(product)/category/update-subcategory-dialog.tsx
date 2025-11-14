import React from "react";

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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// Local
import SubCategoryForm from "./sub-category-form"
import getCategories from "@/actions/category/get-category";

// Icon
import { Edit } from "lucide-react";

export default async function UpdateSubcategoryDialog(
    {defaultCategory, name, description, categoryId}: {
        defaultCategory?: string,
        name?: string,
        description?: string,
        categoryId?: string
    }
) {
    const categories = await getCategories();

    return (
        <Dialog>
            <DialogTrigger>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Edit size={16}/>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit</p>
                    </TooltipContent>
                </Tooltip>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] px-0 md:px-2">
                <DialogHeader>
                    <DialogTitle>Add New Sub Category</DialogTitle>
                    <DialogDescription>
                        New sub category description.
                    </DialogDescription>
                </DialogHeader>

                {/* Scroll only the dialog body so header/footer remain visible */}
                <ScrollArea className="max-h-[60vh]">
                    <SubCategoryForm categories={categories.map(category => {
                        return {label: category.name, value: category.id}
                    })}
                                     defaultCategory={defaultCategory}
                                     name={name}
                                     description={description}
                                     categoryId={categoryId}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
