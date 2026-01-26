import React, { memo } from 'react';
import Image from 'next/image';

// ShadCN
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
    Item,
    ItemGroup,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"

// Types
import { type GetOrdersType } from '@/actions/order/get-orders';

interface ItemCount {
    [sku: string]: {
        name: string;
        quantity: number;
        imageUrl: string;
    };
}

const OrderItem = ({data}: { data: ItemCount }) => {
    return (
        <ItemGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data).map(([sku, item]) => (
                <Item key={sku} className="border p-4 rounded-lg" variant="outline" role="listitem">
                    <ItemMedia>
                        <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="object-cover rounded"
                        />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>{item.name}</ItemTitle>
                        <ItemDescription>SKU: {sku}</ItemDescription>
                    </ItemContent>
                    <ItemContent className="flex-none text-center">
                        <ItemDescription className={'text-2xl font-semibold'}>{item.quantity}</ItemDescription>
                    </ItemContent>
                </Item>
            ))}
        </ItemGroup>
    );
};

const LineItem = ({selectedOrder}: { selectedOrder: Record<string, GetOrdersType> }) => {
    const itemCount: ItemCount = {};
    Object.values(selectedOrder).forEach(order => {
        order.items.forEach((item) => {
            if (itemCount[item.sku]) {
                itemCount[item.sku].quantity += item.quantity;
            } else {
                itemCount[item.sku] = {
                    name: item.variationName,
                    quantity: item.quantity,
                    imageUrl: item.variation.images[0].image.thumbnailUrl,
                };
            }
        });
    });
    console.log('itemCount', itemCount);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="secondary" size={'sm'} disabled={Object.keys(itemCount).length === 0}>
                    Line Item
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Individual total</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto h-full p-4">
                    <OrderItem data={itemCount}/>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default memo(LineItem);