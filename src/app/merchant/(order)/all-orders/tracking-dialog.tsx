import React from 'react';

// ShadCN
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

const TrackingDialog = ({orderId}: {orderId: string}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Track Order</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Order Tracking for {orderId}</DialogTitle>
                    <DialogDescription>
                        {/* Tracking details would go here */}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default TrackingDialog;