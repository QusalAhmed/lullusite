'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ShadCN
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"

// Icon
import { Trash, Plus, Minus, ShoppingCart, X, Equal } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { removeItem, addItem, minusItem } from "@/lib/redux/features/cart/cartSlice";
import type { RootState } from "@/lib/redux/store";

function EmptyCart({storeSlug}: { storeSlug: string }) {
    return (
        <div className='h-svh flex items-center justify-center'>
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
        </div>
    )
}

const Cart = ({storeSlug}: { storeSlug: string }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(
        (state: RootState) => state.cart.carts
    );

    return (
        <>
            {cartItems.length === 0 ? (
                <EmptyCart storeSlug={storeSlug}/>
            ) : (
                <div className='max-w-3xl mx-auto p-4 flex flex-col gap-6'>
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold mt-2">Shopping Cart</h1>
                        <Badge variant="secondary" className="mt-1 bg-green-500 text-white">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                        </Badge>
                    </div>
                    <div className="flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 border p-4 rounded-lg">
                                <Image
                                    src={item.images[0].image.thumbnailUrl}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="object-cover rounded self-start"
                                />
                                <div className="flex-1">
                                    <h2 className="font-semibold">{item.name}</h2>
                                    <h5 className="text-sm text-gray-500">{item.description}</h5>
                                    <p className="flex items-center gap-1">
                                        <FaBangladeshiTakaSign/>
                                        <span className={'font-semibold'}>{item.price}</span>
                                        <X size={12}/>
                                        {item.quantity}
                                        <Equal/>
                                        <FaBangladeshiTakaSign/>
                                        {item.price * item.quantity}
                                    </p>
                                    <div className="flex items-center gap-2 justify-between mt-2">
                                        <div className={'flex items-center gap-2'}>
                                            <Button
                                                size="icon-sm"
                                                variant="outline"
                                                onClick={() => dispatch(minusItem({id: item.id}))}
                                            >
                                                <Minus size={16}/>
                                            </Button>
                                            <span>{item.quantity}</span>
                                            <Button
                                                size="icon-sm"
                                                variant="outline"
                                                onClick={() => dispatch(addItem(item))}
                                            >
                                                <Plus size={16}/>
                                            </Button>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => dispatch(removeItem(item.id))}
                                        >
                                            <Trash size={16} color={'red'}/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant='secondary' asChild>
                        <Link href={`/store/${storeSlug}`}>Continue Shopping</Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/store/${storeSlug}/checkout`}>Proceed to Checkout</Link>
                    </Button>
                </div>
            )}
        </>
    );
};

export default Cart;