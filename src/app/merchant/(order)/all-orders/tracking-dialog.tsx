import React from 'react';

// ShadCN
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';

// Icon
import {LandPlot} from "lucide-react";

// Action
import getTracking from '@/actions/order/get-tracking';

// Tanstack React Query
import { useQuery } from '@tanstack/react-query';

const TrackingDialog = ({orderId}: { orderId: string }) => {
    const {data, isLoading, error} = useQuery({
        queryKey: ['tracking', orderId],
        queryFn: () => getTracking(orderId),
    });
    console.log('Tracking data:', data);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">View Tracking</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Order Tracking</SheetTitle>
                    <SheetDescription>
                        View the tracking history for this order.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-4 overflow-y-auto max-h-96">
                    {isLoading && <p>Loading tracking information...</p>}
                    {error && <p className="text-red-500">Error loading tracking information.</p>}
                    {data && data.length === 0 && <p className={'text-gray-600 text-center'}>No tracking information available.</p>}
                    {data && data.length > 0 && (
                        <div className={'flex flex-col justify-center gap-4'}>
                            {data.map(tracking => (
                                <div key={tracking.id} className="flex justify-around items-center">
                                    <div className="p-2 bg-gray-200 rounded-full">
                                        <LandPlot/>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {new Date(tracking.updatedAt).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-700">{tracking.trackingMessage}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="secondary">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default TrackingDialog;