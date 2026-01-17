'use client';

import React, { useState, useRef, useEffect, memo } from 'react';

// ShadCN
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

// Local
import ItemTable from './item-table'

// Actions
import getItems from '@/actions/product/get-items-for-order'

// Tanstack Query
import { useQuery, keepPreviousData } from '@tanstack/react-query'

// Tanstack Table
import { type RowSelectionState } from "@tanstack/react-table";

// Icon
import { RefreshCcw } from "lucide-react";

interface ItemType {
    variationId: string
    variationName: string;
    quantity: number;
    unitPrice: number;
    thumbnailUrl: string;
}

const ItemPicker = (
    {handleAddItem, currentItems}: { handleAddItem: (items: ItemType[]) => void, currentItems: ItemType[] }
) => {
    const [open, setOpen] = useState(false);
    const rowSelectionRef = useRef<RowSelectionState>({});
    
    useEffect(() => {
        rowSelectionRef.current = currentItems.reduce((acc, item) => {
            acc[item.variationId] = true;
            return acc;
        }, {} as RowSelectionState);
    }, [currentItems]);

    const {data, isLoading, error, refetch} = useQuery({
        queryKey: ['items-for-order'],
        queryFn: () => getItems(),
        placeholderData: keepPreviousData,
        gcTime: Infinity,
        staleTime: Infinity,
    })
    console.log('Fetched Items:', data);

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
                        Select item and click continue to add them
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
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner/>
                    </div>
                ) : error ? (
                    <div className="p-4 text-red-500">
                        Error loading items.
                    </div>
                ) : (
                    <ItemTable
                        orderData={orderData}
                        rowSelectionRef={rowSelectionRef}
                    />
                )}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={() => {
                            const rowSelection = rowSelectionRef.current;
                            const selectedItems: ItemType[] = [];
                            for (const key in rowSelection) {
                                const row = orderData.find(item =>
                                    item.variations.some(variation => variation.id === key)
                                );
                                if (row) {
                                    const variation = row.variations.find(variation => variation.id === key);
                                    if (variation) {
                                        selectedItems.push({
                                            variationId: variation.id,
                                            variationName: variation.name,
                                            quantity: 1,
                                            unitPrice: parseFloat(variation.price),
                                            thumbnailUrl: variation.imageUrl || '',
                                        });
                                    }
                                }
                            }
                            handleAddItem(selectedItems);
                            setOpen(false);
                        }}
                    >
                        Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default memo(ItemPicker);
