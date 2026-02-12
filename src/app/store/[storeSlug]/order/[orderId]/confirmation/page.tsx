import React from 'react';
import { CheckCircle2, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// local
import OrderDetails from "@/components/store/order-details";

const PurchaseConfirmation = async (
    {params}: { params: Promise<{ orderId: string, storeSlug: string }> }
) => {
    const {orderId, storeSlug} = await params;

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
            {/* Header */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-b py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-30"></div>
                                <CheckCircle2 className="size-12 text-green-600 dark:text-green-400 relative"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
                                <p className="text-muted-foreground mt-2">Thank you for your purchase. I will contact you soon to
                                    confirm order</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <OrderDetails orderId={orderId} storeSlug={storeSlug}/>

            {/* Additional Information */}
            <div className="max-w-4xl mx-auto px-4">
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                            <Truck className="size-5"/>
                            What&#39;s Next?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-blue-900 dark:text-blue-200 space-y-3">
                        <p>
                            ✓ <span className="font-medium">Confirmation Message</span> - A confirmation message has been sent to your
                            phone number
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