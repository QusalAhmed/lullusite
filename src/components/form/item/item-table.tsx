'use client';

import React, { useEffect, useEffectEvent, useState, RefObject } from 'react';

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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input";

// Type
import type OrderDataType from "@/types/order";

// Local
import itemColumns from './item-columns'

// Tanstack Table
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
    RowSelectionState,
    getExpandedRowModel,
    getPaginationRowModel,
    getFilteredRowModel
} from '@tanstack/react-table'

const ItemTable = (
    {orderData, rowSelectionRef}:{ orderData: OrderDataType[], rowSelectionRef: RefObject<RowSelectionState> }
) => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(rowSelectionRef.current || {});
    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });
    console.log('Row Selection:', rowSelection);
    
    const setInitialRowSelection = useEffectEvent(() => {
        setRowSelection(rowSelectionRef.current || {});
    });

    useEffect(() => {
        setInitialRowSelection();
    }, []);

    useEffect(() => {
        rowSelectionRef.current = rowSelection;
    }, [rowSelection, rowSelectionRef]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: orderData,
        columns: itemColumns,
        state: {
            rowSelection,
            expanded: true,
            pagination,
        },
        getSubRows: (originalRow) => originalRow.variations,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: row => row.original.stock !== '0',
        getExpandedRowModel: getExpandedRowModel(),
        getRowId: (row) => row.id,
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: false,
        onPaginationChange: setPagination,
        paginateExpandedRows: false,
        getFilteredRowModel: getFilteredRowModel(),
        // filterFromLeafRows: true,
        maxLeafRowFilterDepth: 1,
    })

    return (
        <>
            <Input
                placeholder="Filter product name..."
                value={table.getState().globalFilter ?? ''}
                onChange={(event) =>
                    table.setGlobalFilter(String(event.target.value))
                }
            />
            <div className="max-h-[60vh] overflow-y-auto border rounded-md">
                <Table className="border-0">
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
                            table.getRowModel().rows.map((row) => {
                                if (!row.getCanExpand() && row.depth == 0) return null;
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => {
                                            row.toggleSelected(!row.getIsSelected())
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={itemColumns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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

                    {table.getPageCount() >= 0 && Array.from({length: table.getPageCount()}, (_, i) => i).map((pageIndex) => {
                        // Show first, last, current, and adjacent pages
                        if (
                            pageIndex === 0 ||
                            pageIndex === table.getPageCount() - 1 ||
                            (pageIndex >= table.getState().pagination.pageIndex - 1 &&
                                pageIndex <= table.getState().pagination.pageIndex + 1)
                        ) {
                            return (
                                <PaginationItem key={pageIndex}>
                                    <PaginationLink
                                        href="#"
                                        aria-current={table.getState().pagination.pageIndex === pageIndex ? 'page' : undefined}
                                        className={table.getState().pagination.pageIndex === pageIndex ? 'bg-blue-500 text-white' : ''}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            table.setPageIndex(pageIndex)
                                        }}
                                    >
                                        {pageIndex + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        } else if (
                            pageIndex === table.getState().pagination.pageIndex - 2 ||
                            pageIndex === table.getState().pagination.pageIndex + 2
                        ) {
                            return <PaginationEllipsis key={pageIndex}/>;
                        } else {
                            return null;
                        }
                    })}

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
        </>
    )
};

export default ItemTable;