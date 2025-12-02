'use client';

import React, { useId } from 'react';

import { NumericFormat } from 'react-number-format';

// Actions
import getProduct from '@/actions/store/get-product'

// Local
import Carousel from './carousel';

// ShadCN
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SlidingNumber } from '@/components/ui/sliding-number';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "@/components/ui/input-group"

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Derive types from getProduct's return type
type Product = Awaited<ReturnType<typeof getProduct>>; // may be undefined if not found
type Variation = NonNullable<Product>['variations'][number];

// Redux
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/lib/redux/store';
import { addItem, minusItem, addNUpdateQuantity, } from '@/lib/redux/features/cart/cartSlice';

function VariationCard({variation}: { variation: Variation }) {
    const cartItems = useSelector(
        (state: RootState) => state.cart.carts
    );
    const quantity = cartItems.find(item => item.id === variation.id)?.quantity || 0
    const id = useId();
    const dispatch = useDispatch();

    return (
        <Card>
            <CardContent>
                <Carousel images={variation.images}/>
            </CardContent>
            <CardHeader>
                <CardTitle>{variation.name}</CardTitle>
                <CardDescription>{variation.description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <div className="flex justify-between items-center w-full px-0.5">
                    <Button
                        variant="default"
                        disabled={quantity === 0}
                        className="h-12 whitespace-normal break-words normal-case w-20 px-2 py-1 leading-tight text-center"
                        onClick={() => {
                            dispatch(minusItem({id: variation.id}));
                        }}
                    >
                        ১ কেজি কমান
                    </Button>

                    <Tooltip defaultOpen={true}>
                        <TooltipTrigger>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="flex items-start">
                                        <SlidingNumber
                                            number={cartItems.find(item => item.id === variation.id)?.quantity || 0}
                                            padStart
                                            className="text-5xl text-orange-600"
                                        />
                                        <span>kg</span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <InputGroup>
                                        <NumericFormat
                                            id={id}
                                            displayType='input'
                                            value={quantity === 0 ? '' : quantity}
                                            min={0}
                                            allowNegative={false}
                                            customInput={InputGroupInput}
                                            placeholder='পরিমাণ লিখুন'
                                            onValueChange={(values, sourceInfo) => {
                                                if (sourceInfo.source === 'event') {
                                                    const quantityValue = parseInt(values.value) || 0;
                                                    dispatch(addNUpdateQuantity({
                                                        ...variation,
                                                        quantity: quantityValue,
                                                    }));
                                                }
                                            }}
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupText>কেজি</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </PopoverContent>
                            </Popover>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>আপনি সিলেক্ট করেছেন</p>
                        </TooltipContent>
                    </Tooltip>


                    <Button
                        variant="default"
                        disabled={quantity === variation.stock && variation.stock !== -1}
                        className="h-12 whitespace-normal break-words normal-case w-20 px-2 py-1 leading-tight text-center"
                        onClick={() => {
                            dispatch(addItem({...variation}));
                        }}
                    >
                        ১ কেজি যোগ করুন
                    </Button>
                </div>

            </CardFooter>
        </Card>
    )
}

const Products = () => {
    const productId = '36e07843-7bba-4d3c-8c5b-a4fc01267b7a';
    const {data, isPending} = useQuery<Product>({
        queryKey: ['product', productId],
        queryFn: async () => {
            return getProduct(productId);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>Product not found.</div>;
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4'>
            {data.variations.map((variation) => (
                <VariationCard key={variation.id} variation={variation}/>
            ))}
        </div>
    );
};

export default Products;