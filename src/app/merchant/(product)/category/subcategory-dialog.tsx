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
import { BadgePlus } from "lucide-react";

export default async function SubCategoryDialog({defaultCategory}: { defaultCategory?: string }) {
    const categories = await getCategories();

    return (
        <Dialog>
            <DialogTrigger>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <BadgePlus size={16} className={'cursor-pointer'}/>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add subcategory</p>
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
                <ScrollArea className="max-h-[60vh]" >
                    <SubCategoryForm categories={categories.map(category => {
                        return {label: category.name, value: category.id}
                    })} defaultCategory={defaultCategory}/>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
