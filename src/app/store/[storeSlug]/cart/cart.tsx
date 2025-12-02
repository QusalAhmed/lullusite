'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ShadCN
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
    ItemGroup,
    ItemHeader
} from "@/components/ui/item"
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

// Icon
import { Trash, Plus, Minus, X, ShoppingCart } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { removeItem, addItem, minusItem } from "@/lib/redux/features/cart/cartSlice";
import type { RootState } from "@/lib/redux/store";

function EmptyCart({storeSlug}: { storeSlug: string }) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ShoppingCart/>
                </EmptyMedia>
                <EmptyTitle>Your card is empty</EmptyTitle>
                <EmptyDescription>
                    You have not added any items to your cart yet.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button asChild>
                    <Link href={`/store/${storeSlug}`}>
                        Continue Shopping
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    )
}

const Cart = ({storeSlug}: { storeSlug: string }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(
        (state: RootState) => state.cart.carts
    );

    return (
        <div className="py-8 px-4 flex flex-col gap-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <EmptyCart storeSlug={storeSlug}/>
            ) : (
                <ItemGroup className="gap-2 max-w-md mx-auto" role="list">
                    {cartItems.map((cartItem) => (
                        <Item key={cartItem.id} variant="outline" role="listitem">
                            <ItemMedia variant="image">
                                <Image
                                    src={cartItem.images[0].image.thumbnailUrl}
                                    alt={cartItem.name}
                                    width={100}
                                    height={100}
                                    className="object-cover"
                                />
                            </ItemMedia>
                            <ItemContent>
                                <ItemHeader>
                                    {cartItem.name}
                                </ItemHeader>
                                <ItemDescription className="flex items-center gap-2">
                                    Price:
                                    <FaBangladeshiTakaSign/>
                                    {cartItem.price.toFixed(2)}
                                    <X size={12}/>
                                    {cartItem.quantity}
                                </ItemDescription>
                                <ItemTitle className="flex items-center gap-2">
                                    Quantity:
                                    <div className={'flex items-center gap-2'}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => dispatch(minusItem({id: cartItem.id}))}
                                        >
                                            <Minus size={12}/>
                                        </Button>
                                        <span>{cartItem.quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => dispatch(addItem(cartItem))}
                                        >
                                            <Plus size={12}/>
                                        </Button>
                                    </div>
                                </ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => dispatch(removeItem(cartItem.id))}
                                >
                                    <Trash/>
                                </Button>
                            </ItemActions>
                        </Item>
                    ))}
                </ItemGroup>
            )}
            <Button variant='secondary' asChild>
                <Link href={`/store/${storeSlug}`}>Continue Shopping</Link>
            </Button>
            <Button asChild>
                <Link href={`/store/${storeSlug}/checkout`}>Proceed to Checkout</Link>
            </Button>
        </div>
    );
};

export default Cart;