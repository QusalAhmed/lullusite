'use client';

import Image from "next/image";

// Type
import type OrderDataType from "@/types/order";

// Tanstack Table
import { createColumnHelper, } from '@tanstack/react-table';

// ShadCN
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"

// Icon
import { CornerLeftDown, CornerDownRight } from "lucide-react"

const columnHelper = createColumnHelper<OrderDataType>();


// Define the columns
export const itemColumns = [
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => {
            if(row.depth === 1){
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                )
            }
        },
    }),
    columnHelper.accessor('name', {
        header: 'Item Name',
        cell: info => (
            <div className={'flex gap-2'}>
                {info.row.getCanExpand() ? (
                    <Button
                        onClick={info.row.getToggleExpandedHandler()}
                        className={'cursor-pointer'}
                        size='icon-sm'
                        variant={'ghost'}
                    >
                        {info.row.getIsExpanded() ? <CornerLeftDown/> :<CornerDownRight/> }
                    </Button>
                ) : info.row.original.imageUrl && (
                        <Image src={info.row.original.imageUrl}
                               alt={info.getValue()}
                               width={40}
                               height={40}
                               className={'rounded object-cover'}
                        />
                    )
                }
                <div>
                    {info.getValue()}
                    {info.row.original.sku && (
                        <div className={'text-xs text-gray-500'}>
                            SKU: {info.row.original.sku}
                        </div>
                    )}
                </div>
            </div>
        )
    }),
    columnHelper.accessor('price', {
        header: 'Price',
        cell: info => `${info.getValue()}`,
    }),
    columnHelper.accessor('stock', {
        header: 'Stock',
        cell: info => info.getValue(),
    }),
];

export default itemColumns;