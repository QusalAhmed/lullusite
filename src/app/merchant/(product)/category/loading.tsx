import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryLoading = () => {
    return (
        <div>
            <div className="flex items-center justify-between p-1 md:p-3 flex-col md:flex-row gap-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-40" />
            </div>

            <div className="m-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="px-4 py-2">
                                        <Skeleton className="h-16 w-16 rounded-md" />
                                    </td>
                                    <td className="px-4 py-2 min-w-[300px]">
                                        <div className="flex flex-col gap-2">
                                            <div>
                                                <Skeleton className="h-5 w-32 mb-1" />
                                                <Skeleton className="h-3 w-48" />
                                            </div>
                                            <div className="indent-3 mt-1">
                                                <Skeleton className="h-4 w-24 mb-2" />
                                                <div className="flex gap-2">
                                                    <Skeleton className="h-6 w-20 rounded-full" />
                                                    <Skeleton className="h-6 w-20 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Skeleton className="h-4 w-40" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-8 rounded" />
                                            <Skeleton className="h-8 w-8 rounded" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoryLoading;

