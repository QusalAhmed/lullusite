import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function ProductTableSkeleton() {
    // Generate 5 skeleton rows
    const skeletonRows = Array.from({ length: 5 }, (_, i) => i)

    return (
        <div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Skeleton className="h-4 w-4" />
                            </TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {skeletonRows.map((index) => (
                            <TableRow key={index}>
                                {/* Checkbox column */}
                                <TableCell>
                                    <Skeleton className="h-4 w-4" />
                                </TableCell>

                                {/* Product column */}
                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        {/* Main product */}
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-[60px] w-[60px] rounded-md" />
                                            <div className="flex flex-col gap-2">
                                                <Skeleton className="h-5 w-[200px]" />
                                                <Skeleton className="h-3 w-[150px]" />
                                            </div>
                                        </div>

                                        {/* Variation (show for some rows to vary) */}
                                        {index % 2 === 0 && (
                                            <div className="ml-5 flex flex-col gap-2 mt-4">
                                                <div className="flex items-center justify-between gap-2 relative before:w-3 before:h-full before:absolute before:top-0 before:-left-4 before:border-l-2 before:border-b-2 before:-translate-y-1/2 before:rounded-bl-md before:border-gray-100 after:h-full after:absolute after:top-0 after:-left-4 after:border-l-2 after:-translate-y-11/12 after:w-3 after:border-gray-100">
                                                    <div className="flex items-center gap-2 z-10">
                                                        <Skeleton className="h-[50px] w-[50px] rounded-md" />
                                                        <div className="flex flex-col gap-1">
                                                            <Skeleton className="h-5 w-[150px]" />
                                                            <div className="flex flex-row justify-between gap-2">
                                                                <Skeleton className="h-6 w-[80px]" />
                                                                <Skeleton className="h-6 w-[80px]" />
                                                            </div>
                                                            <Skeleton className="h-3 w-[120px]" />
                                                        </div>
                                                    </div>
                                                    <Skeleton className="h-6 w-12 rounded-full" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Price column */}
                                <TableCell>
                                    <Skeleton className="h-5 w-[80px]" />
                                </TableCell>

                                {/* Stock column */}
                                <TableCell>
                                    <Skeleton className="h-6 w-[50px]" />
                                </TableCell>

                                {/* Actions column */}
                                <TableCell>
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination skeleton */}
            <div className="flex items-start justify-around w-full">
                <div className="flex-1 text-sm py-4">
                    <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Skeleton className="h-9 w-[80px]" />
                    <Skeleton className="h-9 w-[60px]" />
                </div>
            </div>
        </div>
    )
}

