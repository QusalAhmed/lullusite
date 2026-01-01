'use client';

import React, { useState } from 'react';

// ShadCN
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

// Local
import ItemTable from './item-table'

// Actions
import getItems from '@/actions/product/get-items-for-order'

// Tanstack Query
import { useQuery, keepPreviousData } from '@tanstack/react-query'

// Icon
import { Search, RefreshCcw } from "lucide-react";

const ItemPicker = () => {
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('')
    const [draftSearchText, setDraftSearchText] = useState('')

    const {data, isLoading, error, refetch} = useQuery({
        queryKey: ['items-for-order', {searchText}],
        queryFn: () => getItems({searchText}),
        placeholderData: keepPreviousData,
        gcTime: Infinity,
        staleTime: Infinity,
    })

    const orderData =
        data?.map(item => {
            const prices = item.variations.map(variation => variation.price)
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            const stock = item.variations.reduce((acc, variation) => {
                if (variation.stock === -1) {
                    return 0
                }
                return acc + variation.stock
            }, 0)
            return {
                id: item.id,
                name: item.name,
                imageUrl: '',
                price: minPrice == maxPrice ? maxPrice.toString() : `${minPrice} - ${maxPrice}`,
                stock: stock.toString(),
                sku: '',
                variations: item.variations.map(variation => ({
                    id: variation.id,
                    name: variation.name,
                    imageUrl: variation.images[0]?.image.thumbnailUrl || '',
                    price: variation.price.toString(),
                    stock: variation.stock === -1 ? '∞' : variation.stock.toString(),
                    sku: variation.sku,
                })),
            }
        }) ?? [];

    const commitSearch = () => {
        setSearchText(draftSearchText.trim())
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    Add Item
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        Add item
                        <Button variant="ghost" size="icon-sm" className="ml-2 p-0"
                                onClick={() => {
                                    refetch().catch((error) => {
                                        console.log(error)
                                    })
                                }}
                        >
                            <RefreshCcw/>
                        </Button>
                    </DialogTitle>
                    <DialogDescription>
                        Select item and click continue to add them
                    </DialogDescription>
                </DialogHeader>
                <InputGroup className="max-w-xs m-2">
                    <InputGroupInput
                        placeholder="Search..."
                        value={draftSearchText}
                        onChange={(e) => setDraftSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                commitSearch()
                            }
                        }}
                    />
                    <InputGroupAddon>
                        <Search/>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            variant="outline"
                            onClick={commitSearch}
                        >
                            Search
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner/>
                    </div>
                ) : error ? (
                    <div className="p-4 text-red-500">
                        Error loading items.
                    </div>
                ) : (
                    <ItemTable orderData={orderData}/>
                )}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ItemPicker;
