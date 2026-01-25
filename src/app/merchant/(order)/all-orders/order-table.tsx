"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

// TanStack Table
import { flexRender, getCoreRowModel, PaginationState, useReactTable, } from "@tanstack/react-table"

// ShadCN
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupButton
} from "@/components/ui/input-group"
import { type DateRange } from "react-day-picker"

// Icons
import { Search, X } from "lucide-react"

// Tanstack Query
import { keepPreviousData, useQuery, } from '@tanstack/react-query'

// Actions
import getOrders, { OrdersResponse, type OrderSearchFilter, type GetOrdersType } from '@/actions/order/get-orders';

// Local
import orderColumns from './columns'
import SetStatusDialog from './set-status-dialog';
import LineItem from './line-item';

// Status
import { OrderStatusType } from '@/db/order.schema'
import { Spinner } from "@/components/ui/spinner"

// Helper to normalize a date to start or end of day
function setToStartOfDay(date: Date): Date {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

function setToEndOfDay(date: Date): Date {
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d
}

function normalizeRange(range: DateRange | undefined): DateRange | undefined {
    if (!range) return undefined

    let {from, to} = range

    if (!from && !to) return undefined

    // If only one side is set, treat as single-day range
    if (from && !to) {
        to = from
    }
    if (!from && to) {
        from = to
    }

    if (!from || !to) return undefined

    return {
        from: setToStartOfDay(from),
        to: setToEndOfDay(to),
    }
}

export default function OrderTable({status}: { status?: OrderStatusType }) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [rowSelection, setRowSelection] = useState({})
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })

    // search/filter state
    const [searchFor, setSearchFor] = useState<OrderSearchFilter extends { searchFor: infer K } ? K : 'customerPhone'>(
        'customerPhone'
    )
    const [searchText, setSearchText] = useState<string>("")
    const [filter, setFilter] = useState<OrderSearchFilter>(null)

    const {data, isLoading, isError, refetch, isRefetching} = useQuery<OrdersResponse>({
        queryKey: ['orders', status, pagination, dateRange, filter],
        queryFn: () =>
            getOrders(
                status,
                pagination.pageSize,
                pagination.pageIndex * pagination.pageSize,
                dateRange,
                filter,
            ),
        placeholderData: keepPreviousData,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
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
        manualFiltering: true,
        getRowId: (originalRow) => originalRow.id,
        state: {
            pagination,
            rowSelection,
        },
        debugTable: true,
    })

    // Store selected row data with IDs
    const [selectedRowsData, setSelectedRowsData] = useState<Record<string, GetOrdersType>>({})

    useEffect(() => {
        // Reset to first page when filters change
        setPagination((old) => ({
            ...old,
            pageIndex: 0,
        }))

        // Clear row selection on filter change
        table.resetRowSelection()
    }, [dateRange, filter, status, table])

    // Update selectedRowsData whenever rowSelection changes
    useEffect(() => {
        setSelectedRowsData((prevState) => {
            const newSelectedRowsData: Record<string, GetOrdersType> = {}
            Object.keys(rowSelection).forEach((rowId) => {
                let row: GetOrdersType | undefined

                try {
                    row = table.getRow(rowId)?.original
                } catch (error) {
                    console.log('Error getting row from table:', error)
                    row = prevState[rowId]
                }

                if (row) {
                    newSelectedRowsData[rowId] = row
                }
            })
            return newSelectedRowsData
        })
    }, [rowSelection, table])

    const currentPage = pagination.pageIndex + 1
    const totalPages = table.getPageCount() || 1

    const handlePageChange = (page: number) => {
        const clamped = Math.min(Math.max(page, 1), totalPages)
        table.setPageIndex(clamped - 1)
    }

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-10">
                <Spinner className="size-8 text-muted-foreground"/>
                <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full flex items-center justify-center py-10">
                <span className="text-sm text-destructive">Error loading orders. Please try again.</span>
            </div>
        );
    }

    return (
        <div className="w-full overflow-auto space-y-4">
            <div className="mb-4 font-medium flex items-center gap-2 overflow-x-auto">
                <span className={'font-semibold'}>Order Date:</span>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        const today = new Date()
                        const from = today
                        const to = today
                        setDateRange(normalizeRange({from, to}))
                    }}
                >
                    Today
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        const today = new Date()
                        const yesterday = new Date()
                        yesterday.setDate(today.getDate() - 1)
                        const from = yesterday
                        const to = yesterday
                        setDateRange(normalizeRange({from, to}))
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
                        const from = last7Days
                        const to = now
                        setDateRange(normalizeRange({from, to}))
                    }}
                >
                    Last 7 Days
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        const now = new Date()
                        const from = new Date(now.getFullYear(), now.getMonth(), 1)
                        const to = now
                        setDateRange(normalizeRange({from, to}))
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
                        const from = lastMonthStart
                        const to = lastMonthEnd
                        setDateRange(normalizeRange({from, to}))
                    }}
                >
                    Last Month
                </Button>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="secondary" size="sm">
                            {dateRange?.from
                                ? dateRange.to
                                    ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                                    : `${dateRange.from.toLocaleDateString()} - ...`
                                : "Select Date Range"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) => {
                                setDateRange(normalizeRange(range))
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDateRange(undefined)}
                >
                    Clear
                </Button>
            </div>
            <div className="flex items-center flex-col md:flex-row w-full md:w-auto">
                <Select
                    value={searchFor}
                    onValueChange={(value) => {
                        setSearchFor(value as typeof searchFor)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Column"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="customerPhone">Customer Phone</SelectItem>
                        <SelectItem value="orderNumber">Order Number</SelectItem>
                        <SelectItem value="customerName">Customer Name</SelectItem>
                    </SelectContent>
                </Select>
                <InputGroup className="max-w-sm w-[90%] m-2">
                    <InputGroupInput
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setFilter(
                                    searchText.trim()
                                        ? {searchFor, searchText}
                                        : null
                                )
                            }
                        }}
                    />
                    <InputGroupAddon>
                        <Search/>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            variant="ghost"
                            onClick={() => {
                                setSearchText("")
                                setFilter(null)
                            }}
                        >
                            <X color={'red'}/>
                        </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            variant="outline"
                            onClick={() => {
                                setFilter(
                                    searchText.trim()
                                        ? {searchFor, searchText}
                                        : null
                                )
                            }}
                        >
                            Search
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
                <div className="text-muted-foreground">
                    {Object.entries(table.getState().rowSelection).length} of{" "}
                    {total} row(s) selected.
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => refetchOrders()}
                    disabled={isRefetching}
                >
                    {isRefetching && <Spinner className="size-4"/>}
                    Refresh
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => table.resetRowSelection()}
                    disabled={Object.keys(rowSelection).length === 0}
                >
                    Clear Selection
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={Object.keys(rowSelection).length === 0}
                >
                    Print
                </Button>
                <SetStatusDialog
                    selectedOrder={
                        table
                            .getSelectedRowModel()
                            .rows.map((row) => ({
                            orderId: row.original.id,
                            orderNumber: row.original.orderNumber,
                            customerName: row.original.shippingFullName,
                            phone: row.original.shippingPhone,
                            address: row.original.shippingAddress,
                            amount: row.original.totalAmount,
                            items: row.original.items.map((item) => ({
                                id: item.id,
                                name: item.variationName,
                                quantity: item.quantity,
                                image: item.variation.images[0].image,
                            })),
                        }))
                    }
                    refetch={refetchOrders}
                />
                <Link href="/merchant/order/create">
                    <Button
                        variant="default"
                        size="sm"
                    >
                        Create Order
                    </Button>
                </Link>
                <LineItem selectedOrder={selectedRowsData}/>
            </div>
            {isRefetching && (
                <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-2 rounded-md bg-background/80 px-4 py-2 shadow-md pointer-events-auto">
                        <Spinner className="size-6 text-muted-foreground"/>
                        <span className="text-sm text-muted-foreground">Updating...</span>
                    </div>
                </div>
            )}
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
                        table.getRowModel().rows.map((row, index) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
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
                                aria-disabled={!table.getCanPreviousPage()}
                                className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
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
                                aria-disabled={!table.getCanNextPage()}
                                className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
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
            {/*<pre>{JSON.stringify(selectedRowsData, null, 2)}</pre>*/}
        </div>
    )
}