import React from 'react';
import { cn } from "@/lib/utils";

// Icon
import { Trash } from "lucide-react";

// Local
import DeleteSubcategoryAlert from './delete-subcategory-alert';

const SubcategoryList = (
    {subCategories}: { subCategories: { id: string; name: string }[] }
) => {
    return (
        <div>
            {subCategories && subCategories.length > 0 ? (
                    <ul className="text-xs text-gray-500 dark:text-gray-300">
                        {subCategories.map((subCategory, index) => (
                            <li key={subCategory.id} className="flex justify-start items-center relative">
                                <div className={cn(
                                    "w-0 h-12 border-b-0 border-l-2 rounded-l-md -translate-y-1/2 absolute -top-1/2",
                                    index === 0 ? "border-l-0 rounded-l-none" : ""
                                )}></div>
                                <div className="w-8 h-12 border-b-2 border-l-2 rounded-bl-md -translate-y-1/2"></div>
                                <div
                                    className="flex justify-between items-center w-full px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                    {subCategory.name}
                                    <DeleteSubcategoryAlert subcategoryId={subCategory.id}>
                                        <Trash size={16}/>
                                    </DeleteSubcategoryAlert>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) :
                <div>
                    <span className="text-xs text-gray-400 dark:text-gray-600 italic">
                        No sub category
                    </span>
                </div>
            }
        </div>
    );
};

export default SubcategoryList;