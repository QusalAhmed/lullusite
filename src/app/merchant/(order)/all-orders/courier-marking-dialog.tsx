import React from 'react';

// ShadCN
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";

// Icon
import { Bike } from "lucide-react";

const CourierMarkingDialog = (
    {orderNumber, parcelId}: { orderNumber: number ,parcelId: string }
) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Badge variant="outline" className={'cursor-pointer'}>
                    <Bike/>
                    <div className="font-semibold text-orange-400">
                        {parcelId}
                    </div>
                </Badge>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>
                        <span className={'text-gray-400 text-md font-normal'}>Courier Marking for Order </span>
                        <span className={'font-bold text-2xl text-green-800'}>#{orderNumber}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="text-center font-semibold text-5xl">
                    {parcelId.match(/.{1,3}/g)?.map((part, index) => (
                        <span key={index} className={`mx-2 ${index % 2 === 0 ? 'text-cyan-700' : 'text-red-600'}`}>
                            {part}
                        </span>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CourierMarkingDialog;