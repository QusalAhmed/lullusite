'use client';

import React from 'react';

// ShadCN
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Redux
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";

const OrderSummary = () => {
    const cartItems = useSelector(
        (state: RootState) => state.cart.carts
    );
    const deliveryCharge = 50;

    // Simple currency/number formatter
    const formatMoney = React.useCallback((n: number) => {
        return n.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }, []);

    const subtotal = React.useMemo(() =>
            cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
        [cartItems]
    );

    const total = React.useMemo(() => subtotal + (cartItems.length ? deliveryCharge : 0), [subtotal, cartItems.length]);

    return (
        <div className="space-y-4 mx-auto w-full">
            {/* Empty state */}
            {cartItems.length === 0 ? (
                <div className="text-sm text-muted-foreground">Your cart is empty.</div>
            ) : (
                <Table>
                    <TableCaption>Order summary</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Line total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cartItems.map((item) => {
                            const lineTotal = (item.price || 0) * item.quantity;
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="max-w-[260px] truncate" title={item.name}>{item.name}</TableCell>
                                    <TableCell className="text-right">{formatMoney(item.price || 0)}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right font-medium">{formatMoney(lineTotal)}</TableCell>
                                </TableRow>
                            );
                        })}
                        {/* Subtotal */}
                        <TableRow>
                            <TableCell colSpan={3} className="text-right">Subtotal</TableCell>
                            <TableCell className="text-right font-medium">{formatMoney(subtotal)}</TableCell>
                        </TableRow>
                        {/* Delivery */}
                        <TableRow>
                            <TableCell colSpan={3} className="text-right">Delivery</TableCell>
                            <TableCell className="text-right font-medium">{formatMoney(deliveryCharge)}</TableCell>
                        </TableRow>
                        {/* Total */}
                        <TableRow>
                            <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(total)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default OrderSummary;