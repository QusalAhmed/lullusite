import React from 'react';
import Link from 'next/link';
import { redirect } from "next/navigation";
import { CheckCircle2, Package, Truck, MapPin, Mail, Phone, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Actions
import getOrderInfo from "@/actions/order/get-order-info";

const PurchaseConfirmation = async (
    {params}: { params: Promise<{ orderId: string, storeSlug: string }> }
) => {
    const {orderId, storeSlug} = await params;
    const orderInfo = await getOrderInfo(orderId)

    if (!orderInfo) {
        redirect('/')
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
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-b py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-30"></div>
                                <CheckCircle2 className="size-12 text-green-600 dark:text-green-400 relative"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
                                <p className="text-muted-foreground mt-2">Thank you for your purchase</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
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
                                <p className="text-lg font-semibold capitalize text-green-600 dark:text-green-400">{orderInfo.status ? 'Confirmed': ''}</p>
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
                                <p className="font-medium">{orderInfo.customerName}</p>
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
                                    <p className="font-medium">{orderInfo.customerPhone}</p>
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
                        <Link href={"/store/" + storeSlug}>
                            View My Orders
                            <ArrowRight className="size-4"/>
                        </Link>
                    </Button>
                </div>

                {/* Additional Information */}
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                            <Truck className="size-5"/>
                            What&#39;s Next?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-blue-900 dark:text-blue-200 space-y-3">
                        <p>
                            ✓ <span className="font-medium">Confirmation Email</span> - A confirmation email has been sent to <span
                            className="font-mono">{orderInfo.customerEmail}</span>
                        </p>
                        <p>
                            ✓ <span className="font-medium">Order Tracking</span> - You&#39;ll receive a tracking number once your
                            order
                            ships. You can track your order in the My Orders section.
                        </p>
                        <p>
                            ✓ <span className="font-medium">Estimated Delivery</span> - Your order is expected to arrive
                            in 2-3 days
                        </p>
                        <p>
                            ✓ <span className="font-medium">Need Help?</span> - Contact our support team if you have any questions
                            about your order.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PurchaseConfirmation;