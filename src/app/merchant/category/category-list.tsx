import React from 'react';
import Image from 'next/image';

// Local
import getCategories from '@/actions/get-category';
import ConfirmDelete from "./confirm-delete"

// Actions

// Icon
import { Pencil } from 'lucide-react';


const CategoryList = async () => {
    const categories = await getCategories();

    return (
        <div
            className="m-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {categories.length === 0 ? (
                <div className="flex h-48 items-center justify-center text-gray-500 dark:text-gray-400">
                    No categories found.
                </div>
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
                                        <div className="relative h-8 w-8 overflow-hidden rounded-md">
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

                                <td className="px-4 py-2 font-semibold text-md dark:text-gray-100">
                                    {category.name}
                                </td>

                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                    {category.description || "—"}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-4">
                                    <ConfirmDelete categoryId={category.id}/>
                                    <Pencil size={16}/>
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