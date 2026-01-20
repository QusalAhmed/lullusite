import React, { useState } from 'react';
import Image from 'next/image';

// ShadCN
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"

// Status
import { orderStatus, OrderStatusType } from '@/db/order.schema'

// Actions
import updateOrderStatus from '@/actions/order/update-status'
import updateOrdersReadyToShip from '@/actions/order/update-status-ready-to-ship';

// Constants
import courierList from '@/constant/courier-list';

interface SelectedOrderProps {
    orderId: string;
    orderNumber: number;
    customerName: string;
    phone: string;
    address: string;
    amount: number;
    items: {
        id: string;
        name: string;
        quantity: number;
        image: {
            id: string;
            thumbnailUrl: string;
        }
    }[];
}

function ReadyShipTable({selectedOrder}: { selectedOrder: SelectedOrderProps[] }) {
    return (
        <Table>
            <TableCaption>A list of selected order.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Order No</TableHead>
                    <TableHead className="w-md">Details</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {selectedOrder.map((row) => (
                    <TableRow key={row.orderId}>
                        <TableCell>
                            <Select defaultValue="steadfast" onValueChange={(value) => {
                                console.log(`Selected courier ${value} for order ${row.orderId}`);

                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Courier"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {courierList.map((courier) => (
                                        <SelectItem key={courier.id} value={courier.id}>
                                            {courier.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className={'text-lg font-semibold text-cyan-700'}>{row.orderNumber}</TableCell>
                        <TableCell>
                            <div className={'font-semibold'}>{row.customerName}</div>

                            <Accordion type="single" collapsible>
                                <AccordionItem value="details">
                                    <AccordionTrigger className='text-blue-600 cursor-pointer'>Expand</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-1 text-balance">
                                        <div className={'font-semibold text-gray-400'}>{row.phone}</div>
                                        <div>{row.address}</div>
                                        <div>
                                            {row.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-2 mt-2">
                                                    <Image
                                                        src={item.image.thumbnailUrl}
                                                        alt={item.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-md"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </TableCell>
                        <TableCell className="text-right">{row.amount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

const SetStatusDialog = (
    {selectedOrder, refetch}: { selectedOrder: SelectedOrderProps[], refetch: () => void }
) => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatusType | null>(null);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger disabled={selectedOrder.length == 0} asChild>
                <Button variant="outline" size="sm">
                    Set Status
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Select order status</SheetTitle>
                    <SheetDescription>
                        <Select
                            value={selectedStatus || undefined}
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
                    </SheetDescription>
                </SheetHeader>
                <ReadyShipTable selectedOrder={selectedOrder}/>
                <SheetFooter className="grid grid-cols-2 gap-4">
                    <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <Button
                        onClick={() => {
                            setIsLoading(true);
                            if (!selectedStatus) return;

                            if (selectedStatus === 'ready_to_ship') {
                                updateOrdersReadyToShip(
                                    selectedOrder.map((order) => ({
                                        orderId: order.orderId,
                                        courier: 'steadfast' // Default courier for demo purposes
                                    }))
                                ).then((res) => {
                                    console.log(res);
                                    setIsLoading(false);
                                    if (res.success) {
                                        refetch()
                                        setOpen(false);
                                        toast.success('Orders updated to ready to ship successfully', res.message);
                                    }
                                }).catch((error) => {
                                    console.error('Error updating orders to ready to ship:', error);
                                    toast.error(error.message || 'Failed to update orders to ready to ship');
                                    setIsLoading(false);
                                });
                            } else {
                                updateOrderStatus(
                                    selectedOrder.map((order) => order.orderId), selectedStatus
                                ).then((res) => {
                                    console.log(res);
                                    setIsLoading(false);
                                    if (res.success) {
                                        refetch()
                                        setOpen(false);
                                    }
                                })
                            }
                        }}
                        disabled={!selectedStatus || isLoading}
                    >
                        {isLoading ? <Spinner/> : 'Set Status'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default SetStatusDialog;
