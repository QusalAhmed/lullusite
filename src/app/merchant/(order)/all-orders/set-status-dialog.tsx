import React, {useState} from 'react';

// ShadCN
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

// Status
import { orderStatus, OrderStatusType } from '@/db/order.schema'

// Actions
import updateOrderStatus from '@/actions/order/update-status'

const SetStatusDialog = (
    {selectedOrderIds, refetch}: {selectedOrderIds: string[], refetch: () => void}
) => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatusType | null>(null);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={selectedOrderIds.length == 0} asChild>
                <Button variant="outline" size="sm">
                    Set Status
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select order status you want to convert to</DialogTitle>
                    <DialogDescription>
                        <Select
                            onValueChange={(value) => setSelectedStatus(value as OrderStatusType)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status"/>
                            </SelectTrigger>
                            <SelectContent>
                                {orderStatus.enumValues.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1).replaceAll('_', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={() => {
                            setIsLoading(true);
                            if (selectedStatus) {
                                updateOrderStatus(selectedOrderIds, selectedStatus).then((res) => {
                                    console.log(res);
                                    if (res.success){
                                        refetch()
                                        setOpen(false);
                                    }
                                });
                            }
                            // setIsLoading(false);
                        }}
                        disabled={!selectedStatus || isLoading}
                    >
                        {isLoading ? <Spinner/> : 'Set Status'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SetStatusDialog;