import React from 'react';
import Image from 'next/image';

// Local
import getCategories from '@/actions/category/get-category';
import ConfirmDelete from "./confirm-delete"
import UpdateCategoryDialog from "./category-update-dialog"

// ShadCN
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

// Icon
import { PiEmptyBold } from "react-icons/pi";

// Local
import NewCategoryDialog from "@/app/merchant/(product)/category/new-category-dialog";
import SubCategoryDialog from "@/app/merchant/(product)/category/subcategory-dialog";
import SubcategoryList from "./subcategory-list";


const CategoryList = async () => {
    const categories = await getCategories();

    return (
        <div
            className="m-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {categories.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiEmptyBold size={56}/>
                        </EmptyMedia>
                        <EmptyTitle>No Category</EmptyTitle>
                        <EmptyDescription>No category found</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <NewCategoryDialog/>
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Image
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Name
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Description
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {categories.map((category) => (
                            <tr
                                key={category.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <td className="px-4 py-2">
                                    {category.image ? (
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                            <Image
                                                src={category.image.thumbnailUrl || category.image.url}
                                                alt={category.image.altText || category.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="h-8 w-8 text-sm rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </td>

                                <td className="px-4 py-2 flex flex-col min-w-[300px]">
                                    <div className={'font-semibold text-md dark:text-gray-100'}>{category.name}</div>
                                    <div className="indent-3 mt-1">
                                        <div className={'flex items-center gap-1'}>
                                            <div className={'text-sm'}>Sub Categories:</div>
                                            <SubCategoryDialog defaultCategory={category.id}/>
                                        </div>
                                        <SubcategoryList subCategories={category.subCategories} categoryId={category.id}/>
                                    </div>
                                </td>

                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                    {category.description || "—"}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className={'flex gap-2'}>
                                        <ConfirmDelete categoryId={category.id}/>
                                        <UpdateCategoryDialog
                                            name={category.name}
                                            description={category.description || ''}
                                            image={category.image ? category.image.id : ''}
                                            categoryId={category.id}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CategoryList;