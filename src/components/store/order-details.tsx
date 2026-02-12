import React from 'react';
import Link from 'next/link';
import { redirect } from "next/navigation";
import { Package, MapPin, Mail, Phone, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Actions
import getOrderInfo from "@/actions/order/get-order-info";

// Constant
import ORDER_STATUS from "@/constant/order-status";

const OrderDetails = async (
    {orderId, storeSlug}: {orderId: string, storeSlug: string}
) => {
    const orderInfo = await getOrderInfo(orderId);

    if (!orderInfo) {
        redirect(`/store/${storeSlug}`);
    }

    const formatCurrency = (amount: number, currency: string) => {
        if (currency === 'BDT') {
            return `${amount.toFixed(2)} ${currency}`;
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Order Number & Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Order Number</p>
                                <p className="text-lg font-semibold">#{orderInfo.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Order Date</p>
                                <p className="text-lg font-semibold">
                                    {orderInfo.createdAt.toLocaleString(undefined, {
                                        timeStyle: 'short',
                                        dateStyle: 'medium',
                                        timeZone: 'Asia/Dhaka',
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="text-lg font-semibold capitalize text-green-600 dark:text-green-400">
                                    {
                                        orderInfo.status === 'pending'  ? 'Confirmed' :
                                            ORDER_STATUS.find(status => status.value === orderInfo.status)?.label || orderInfo.status
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                                <p className="text-lg font-semibold">2-3 Days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer & Contact Info */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="size-5"/>
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-medium">{orderInfo.shippingFullName}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="size-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{orderInfo.customerEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="size-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{orderInfo.shippingPhone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="size-5"/>
                                Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Full Name</p>
                                <p className="font-medium">{orderInfo.shippingFullName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Address</p>
                                <p className="font-medium">
                                    {orderInfo.shippingAddress}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">City, State & Postal Code</p>
                                <p className="font-medium">
                                    {orderInfo.shippingCity}
                                    {orderInfo.shippingState && `, ${orderInfo.shippingState}`}
                                    {orderInfo.shippingPostalCode && ` ${orderInfo.shippingPostalCode}`}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Country</p>
                                <p className="font-medium">{orderInfo.shippingCountry}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="size-5"/>
                            Order Items
                        </CardTitle>
                        <CardDescription>
                            {orderInfo.items.length} {orderInfo.items.length === 1 ? 'item' : 'items'} in this order
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orderInfo.items.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    {index > 0 && <Separator/>}
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.variationName}</p>
                                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{formatCurrency(item.lineSubtotal, orderInfo.currency)}</p>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(item.unitPrice, orderInfo.currency)} each</p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{formatCurrency(orderInfo.subtotalAmount, orderInfo.currency)}</span>
                            </div>
                            {orderInfo.discountAmount > 0 && (
                                <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span
                                        className="font-medium">-{formatCurrency(orderInfo.discountAmount, orderInfo.currency)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-medium">{formatCurrency(orderInfo.shippingAmount, orderInfo.currency)}</span>
                            </div>
                            <Separator/>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-semibold">Total</span>
                                <span
                                    className="text-2xl font-bold text-primary">{formatCurrency(orderInfo.totalAmount, orderInfo.currency)}</span>
                            </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 mt-6">
                            <p className="text-sm">
                                <span className="font-semibold">Payment Method: </span>
                                <span className="text-muted-foreground">{orderInfo.paymentMethod}</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Button asChild variant="outline" size="lg">
                        <Link href={"/store/" + storeSlug}>
                            <Home className="size-4"/>
                            Back to Home
                        </Link>
                    </Button>
                    <Button asChild size="lg">
                        <Link href={"/store/" + storeSlug + "/order/" + orderId + "/tracking"}>
                            Track Order
                            <ArrowRight className="size-4"/>
                        </Link>
                    </Button>
                </div>
            </div>
    );
};

export default OrderDetails;