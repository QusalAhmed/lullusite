"use client"

import { useState } from "react"

// TanStack Table
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    PaginationState,
} from "@tanstack/react-table"

// ShadCN
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationEllipsis,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"

// Tanstack Query
import {
    useQuery,
    keepPreviousData,
    // useMutation,
    // useQueryClient,
} from '@tanstack/react-query'

// Actions
import getOrders, { OrdersResponse } from '@/actions/order/get-orders';

// Local
import orderColumns from './columns'
import SetStatusDialog from './set-status-dialog';

// Status
import { OrderStatusType } from '@/db/order.schema'

export default function OrderTable({status}: { status?: OrderStatusType }) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // initial page index
        pageSize: 10, // default page size
    });
    const [rowSelection, setRowSelection] = useState({})
    const [dateRange, setDateRange] = useState<{ startDate: Date | null, endDate: Date | null }>({startDate: null, endDate: null});

    const {data, isLoading, isError, refetch} = useQuery<OrdersResponse>({
        queryKey: ['orders', status, pagination, dateRange],
        queryFn: () =>
            getOrders(
                status,
                pagination.pageSize,
                pagination.pageIndex * pagination.pageSize,
                dateRange
            ),
        placeholderData: keepPreviousData,
        refetchOnMount: "always",
        staleTime: Infinity,
    });
    console.log('Fetched orders data:', data);

    const refetchOrders = () => {
        refetch().then(() => {
            console.log('Orders refetched');
            table.resetRowSelection();
        });
    };

    const orders = data?.data ?? []
    const total = data?.total ?? 0

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: orders,
        columns: orderColumns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: total, // total rows returned from server
        pageCount: total > 0 ? Math.ceil(total / pagination.pageSize) : 0,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        getRowId: (originalRow) => originalRow.id,
        state: {
            pagination,
            rowSelection,
        },
        debugTable: true,
    })

    const currentPage = pagination.pageIndex + 1
    const totalPages = table.getPageCount() || 1

    const handlePageChange = (page: number) => {
        const clamped = Math.min(Math.max(page, 1), totalPages)
        table.setPageIndex(clamped - 1)
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading orders.</div>;
    }

    return (
        <div className="w-full overflow-auto">
            <div className="mb-4 font-medium flex items-center gap-2">
                <span className={'font-semibold'}>Order Date:</span>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        const today = new Date()
                        setDateRange({startDate: today, endDate: today})
                    }}
                >
                    Today
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        const yesterday = new Date()
                        yesterday.setDate(yesterday.getDate() - 1)
                        setDateRange({startDate: yesterday, endDate: yesterday})
                    }}
                >
                    Yesterday
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        const now = new Date()
                        const last7Days = new Date()
                        last7Days.setDate(now.getDate() - 7)
                        setDateRange({startDate: last7Days, endDate: now})
                    }}
                >
                    Last 7 Days
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        const now = new Date()
                        const last30Days = new Date()
                        last30Days.setDate(now.getDate() - 30)
                        setDateRange({startDate: last30Days, endDate: now})
                    }}
                >
                    Last 30 Days
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        const now = new Date()
                        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
                        setDateRange({startDate: thisMonthStart, endDate: now})
                    }}
                >
                    This Month
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        const now = new Date()
                        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
                        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
                        setDateRange({startDate: lastMonthStart, endDate: lastMonthEnd})
                    }}
                >
                    Last Month
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-muted-foreground">
                    {Object.entries(table.getState().rowSelection).length} of{" "}
                    {total} row(s) selected.
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => table.resetRowSelection()}
                >
                    Clear Selection
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                >
                    Print
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                >
                    <SetStatusDialog selectedOrderIds={Object.keys(rowSelection)} refetch={refetchOrders} />
                </Button>
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={orderColumns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between space-y-4 py-4 flex-col md:flex-row">
                <div className="flex items-center gap-2">
                    <span className='text-gray-400'>Item per page:</span>
                    <Select
                        value={pagination.pageSize.toString()}
                        onValueChange={(value) => {
                            const newSize = Number(value)
                            setPagination(() => ({
                                pageIndex: 0,
                                pageSize: newSize,
                            }))
                            table.setPageSize(newSize)
                        }}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder={pagination.pageSize.toString()}/>
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={pageSize.toString()}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (table.getCanPreviousPage()) {
                                        table.previousPage()
                                    }
                                }}
                            />
                        </PaginationItem>

                        <PaginationItem hidden={totalPages <= 5 || currentPage <= 3}>
                            <PaginationEllipsis/>
                        </PaginationItem>

                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => {
                            if (
                                totalPages > 5 &&
                                page !== 1 &&
                                page !== totalPages &&
                                Math.abs(page - currentPage) > 1
                            ) {
                                return null
                            }

                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === currentPage}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handlePageChange(page)
                                        }}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })}

                        <PaginationItem hidden={totalPages <= 5 || currentPage >= totalPages - 2}>
                            <PaginationEllipsis/>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (table.getCanNextPage()) {
                                        table.nextPage()
                                    }
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/*<pre>{JSON.stringify(pagination, null, 2)}</pre>*/}
            {/*<pre>{JSON.stringify(rowSelection, null, 2)}</pre>*/}
        </div>
    )
}