import React, {Suspense} from 'react';

// Local
import NewCategoryDialog from './new-category-dialog'
import CategoryList from './category-list';

// ShadCN
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

function LoadingCategories() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Table className="w-[80%] max-w-3xl">
                <TableCaption>
                    <Skeleton className="h-4 w-40 mx-auto rounded-full" />
                </TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">
                            <Skeleton className="h-4 w-16 rounded-full" />
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-4 w-16 rounded-full" />
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-4 w-16 rounded-full" />
                        </TableHead>
                        <TableHead className="text-right">
                            <Skeleton className="h-4 w-16 rounded-full ml-auto" />
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {[...Array(4)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton className="h-4 w-24 rounded-full" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-24 rounded-full" />
                            </TableCell>
                            <TableCell className="text-right">
                                <Skeleton className="h-4 w-16 ml-auto rounded-full" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

const CategoryPage = () => {
    return (
        <div>
            <div className={'flex items-center justify-between p-1 md:p-3 flex-col md:flex-row gap-2'}>
                <h1 className={'text-blue-600 font-semibold text-2xl'}>Category</h1>
                <NewCategoryDialog/>
            </div>
            <Suspense fallback={<LoadingCategories/>}>
                <CategoryList/>
            </Suspense>
        </div>
    );
};

export default CategoryPage;