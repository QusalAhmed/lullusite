"use client"

import Image from "next/image"
import Link from "next/link"

import { ColumnDef } from "@tanstack/react-table"

// ShadCN
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Type
import { Products } from "@/actions/product/get-products"

// Icon
import { MoreHorizontal } from "lucide-react"

// Local
import CopyUI from "./Copy"
import ProductStatus from "./product-status"

export const columns: ColumnDef<Products>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "product",
        header: "Product",
        cell: ({row}) => {
            const product = row.original
            const productImage = product.images?.[0]?.image?.thumbnailUrl || '/placeholder.png'

            return (
                <div className='flex flex-col gap-2'>
                    {/*Main product*/}
                    <div className="flex items-center gap-2 z-10">
                        {productImage && (
                            <Image src={productImage}
                                   alt={product.name}
                                   width={60}
                                   height={60}
                                   className="rounded-md"
                            />
                        )}
                        <div className="flex flex-col">
                            <div className="font-semibold text-md">{product.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center">
                                ID: {product.id}
                                <Tooltip>
                                    <TooltipTrigger>
                                        <CopyUI text={product.id}/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Copy product id</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    {/*Product Variations*/}
                    {product.variations.length > 0 && (
                        <div className={'ml-5 flex flex-col gap-2 mt-4'}>
                            {product.variations.map((variation) => {
                                const variationImage = variation.images?.[0]?.image?.thumbnailUrl || '/placeholder.png'
                                return (
                                    /*Single Variation*/
                                    <div key={variation.id}
                                         className="flex items-center justify-between gap-2 relative before:w-3 before:h-full before:absolute before:top-0 before:-left-4 before:border-l-2 before:border-b-2 before:-translate-y-1/2 before:rounded-bl-md before:border-gray-400 after:h-full after:absolute after:top-0 after:-left-4 after:border-l-2 after:-translate-y-11/12 after:w-3 after:border-gray-400"
                                    >
                                        <div className={'flex items-center gap-2 z-10'}>
                                            <Image src={variationImage}
                                                   alt={variation.name}
                                                   width={50}
                                                   height={50}
                                                   className="rounded-md"
                                            />
                                            <div className={'flex flex-col gap-1'}>
                                                <div className="font-semibold text-md">{variation.name}</div>
                                                <div className={'flex flex-row justify-between text-sm gap-2'}>
                                                    <Badge variant={variation.stock == 0 ? 'destructive' : 'secondary'}
                                                           className="px-2 py-1"
                                                    >
                                                        <span className={'font-light'}>Stock: </span>
                                                        <span className={'font-semibold'}>
                                                            {variation.stock === -1 ?
                                                                <span className={'text-emerald-400'}>Unlimited</span> :
                                                                variation.stock
                                                            }
                                                        </span>
                                                    </Badge>
                                                    <Badge variant="secondary" className="px-2 py-1">
                                                        <span className={'text-gray-500'}>Price: </span>
                                                        <span className={'font-semibold'}>{variation.price}</span>
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center">
                                                    SKU: {variation.sku}
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <CopyUI text={variation.sku}/>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Copy SKU</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <ProductStatus isActive={variation.isActive} variationId={variation.id}/>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{variation.isActive ? 'Deactivate' : 'Activate'} Product</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )
        },
    },
    {
        id: "price",
        header: "Price",
        cell: ({row}) => {
            const product = row.original
            const prices = product.variations.map((variation) => variation.price)
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)

            return (
                <div className='flex flex-col gap-2'>
                    {minPrice === maxPrice
                        ? `${minPrice.toFixed(2)}`
                        : `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`}
                </div>
            )
        },
    },
    {
        id: "stock",
        header: "Stock",
        cell: ({row}) => {
            const product = row.original
            const totalStock = product.variations.reduce((acc, variation) => acc + variation.stock, 0)

            return (
                <div className='flex flex-col gap-2'>
                    <div className={'font-semibold text-lg'}>{totalStock}</div>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({row}) => {
            const product = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(product.id)}
                        >
                            Copy product ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/merchant/edit-product/${product.id}`}>
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]