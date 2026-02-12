import React from 'react';
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Truck } from 'lucide-react'

// ShadCN
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// local
import OrderDetails from "@/components/store/order-details";
import TrackingTimeline from '@/components/store/tracking-timeline'

// Actions
import getOrderInfo from '@/actions/order/get-order-info'
import getStoreTracking from '@/actions/order/get-store-tracking'

const TrackingPage = async (
    {params}: { params: Promise<{ orderId: string, storeSlug: string }> }
) => {
    const {orderId, storeSlug} = await params;

    const orderInfo = await getOrderInfo(orderId)
    if (!orderInfo) {
        redirect(`/store/${storeSlug}`)
    }

    // Tracking is store-safe (no merchant session required)
    const tracking = await getStoreTracking(orderId)

    const timelineItems = tracking.map(t => ({
        id: t.id,
        message: t.trackingMessage,
        at: t.updatedAt,
    }))

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b py-10">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-start justify-between gap-1">
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-400 rounded-full blur-lg opacity-20" />
                                <Truck className="size-12 text-indigo-600 dark:text-indigo-400 relative" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Track your order</h1>
                                <p className="text-muted-foreground mt-2">
                                    Order <span className="font-medium text-foreground text-xl">#{orderInfo.orderNumber}</span> • Status:{' '}
                                    <span className="capitalize text-2xl font-semibold text-green-500">
                                        {orderInfo.status === 'pending' ? 'confirmed' : orderInfo.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <Button asChild variant="outline" className="shrink-0">
                            <Link href={`/store/${storeSlug}`}>
                                <ArrowLeft className="size-4" />
                                Back to store
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tracking */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tracking updates</CardTitle>
                        <CardDescription>
                            Refresh this page as your order moves through fulfillment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrackingTimeline items={timelineItems} />
                    </CardContent>
                </Card>

                {/* Details (reuse existing component) */}
                <OrderDetails orderId={orderId} storeSlug={storeSlug}/>
            </div>
        </div>
    );
};

export default TrackingPage;