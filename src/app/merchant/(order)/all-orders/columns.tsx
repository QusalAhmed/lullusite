import Image from 'next/image';
import Link from 'next/link';
import { NumericFormat } from 'react-number-format';
import { cn } from '@/lib/utils';

// TanStack Table
import { createColumnHelper } from '@tanstack/react-table';
import { GetOrdersType } from '@/actions/order/get-orders';

// ShadCN
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

// Icon
import { X, ChevronDown, Phone } from "lucide-react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

// Local
import TrackingDialog from './tracking-dialog';
import FraudReport from '../../../../components/fraud-report';
import ImageDialog from '@/components/image-hub/image-dialog'
import Copy from '@/components/Copy';
import CourierMarkingDialog from './courier-marking-dialog';
import CreateOrderSheet from './create-order-sheet';
import SellerNote from './seller-note';

// Actions
import updateOrderStatus from "@/actions/order/update-status";

// Constant
import PAYMENT_STATUS from '@/constant/payment-status';

const columnHelper = createColumnHelper<GetOrdersType>();

function handleStatusUpdate(orderId: string, newStatus: string) {
    updateOrderStatus([orderId], newStatus)
        .then((res) => {
            if (res.success) {
                toast.success('Order status updated successfully');
            } else {
                toast.error(res.error || 'Failed to update order status');
            }
        })
        .catch(() => {
            toast.error('Failed to update order status');
        });
}

const orderColumns = [
    columnHelper.display({
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    }),
    columnHelper.display({
        id: 'product',
        header: 'Product',
        cell: (info) => {
            const items = info.row.original.items;

            return (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <div>
                                Order Number:{' '}
                                <span className='font-semibold'>{info.row.original.orderNumber}</span>
                            </div>
                            {info.row.original.isCourierBooked && info.row.original.consignmentsId && (
                                <CourierMarkingDialog parcelId={info.row.original.consignmentsId}
                                                      orderNumber={info.row.original.orderNumber}
                                />
                            )}
                        </div>
                        <Badge variant="default">
                            {items.length} {items.length > 1 ? 'Items' : 'Item'}
                        </Badge>
                    </div>
                    {items.map((item) => {
                        const product = item.variation.product;
                        const variation = item.variation;
                        const imageUrl = variation?.images?.[0]?.image?.thumbnailUrl || '/placeholder.png';
                        return (
                            <div key={item.id} className="flex items-start space-x-2 mb-4 w-80">
                                <ImageDialog imageSrc={imageUrl} imageAlt={item.variationName || 'Product Image'}>
                                    <Image
                                        src={imageUrl}
                                        alt={item.variationName || 'Product Image'}
                                        width={50}
                                        height={50}
                                        className="object-cover rounded"
                                    />
                                </ImageDialog>
                                <div className='w-full'>
                                    <div className='font-semibold'>{product.name}</div>
                                    <div className="flex flex-col">
                                        <div className="text-sm text-gray-500">
                                            Variation: {item.variationName}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            Qty:
                                            <span className='font-semibold text-lg text-amber-400 pl-2'>{item.quantity}</span>
                                            <X className="inline-block mx-1 text-gray-400" size={16}/>
                                            <FaBangladeshiTakaSign/>
                                            {item.unitPrice.toFixed(2)}
                                        </div>
                                    </div>
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="item-details">
                                            <AccordionTrigger className="p-0 cursor-pointer text-cyan-800">More</AccordionTrigger>
                                            <AccordionContent className="flex flex-col gap-2 text-balance">
                                                <div className="text-sm text-gray-500 mt-1">
                                                    <div>SKU: {item.sku}</div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
        },
    }),
    columnHelper.display({
        id: 'customer',
        header: 'Customer',
        cell: (info) => (
            <div className="flex flex-col gap-2 min-w-xs max-w-md whitespace-normal">
                <div className='text-sm text-gray-500 font-semibold'>
                    <Copy text={info.row.original.shippingFullName}/>
                </div>
                <div className="text-sm text-gray-500">
                    <Copy text={info.row.original.shippingAddress}/>
                </div>
                <div className="font-semibold flex items-center justify-between gap-2">
                    <Copy text={info.row.original.shippingPhone}/>
                    <Link href={`tel:${info.row.original.shippingPhone}`}>
                        <Phone className="inline-block text-green-600 hover:scale-110 transition-transform" size={16}/>
                    </Link>
                </div>
                <FraudReport phoneNumber={info.row.original.shippingPhone}/>
                {info.row.original.customerNote && (
                    <div className="text-sm text-gray-800 bg-green-100 p-2 rounded wrap-break-word whitespace-pre-wrap">
                        {info.row.original.customerNote}
                    </div>
                )}
            </div>
        ),
    }),
    columnHelper.accessor('totalAmount', {
        header: 'Total Amount',
        cell: (info) => (
            <div className='flex items-center'>
                <FaBangladeshiTakaSign/>
                <NumericFormat
                    value={info.getValue()}
                    displayType="text"
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                    className="font-semibold text-lg ml-1"
                />
            </div>
        ),
    }),
    columnHelper.display({
        id: 'status',
        header: () => (
            <div className="text-center">
                Status
            </div>
        ),
        cell: (info) => {
            const orderStatus = info.row.original.status;
            const paymentStatus = info.row.original.paymentStatus;
            const isRepeatOrder = info.row.original.repeatOrder;
            return (
                <div className="flex flex-col gap-1 items-center">
                    <Badge
                        variant="outline"
                        className={cn(
                            orderStatus === 'pending' && 'bg-yellow-100 text-yellow-800',
                            orderStatus === 'confirmed' && 'bg-blue-100 text-blue-800',
                            orderStatus === 'shipped' && 'bg-indigo-100 text-indigo-800',
                            orderStatus === 'delivered' && 'bg-green-100 text-green-800',
                            orderStatus === 'cancelled' && 'bg-red-100 text-red-800',
                        )}
                    >
                        {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1).replaceAll('_', ' ')}
                    </Badge>
                    <Badge
                        variant="outline"
                        className={cn(
                            paymentStatus === 'paid' && 'bg-green-100 text-green-800',
                            paymentStatus === 'unpaid' && 'bg-cyan-400 text-cyan-900',
                            paymentStatus === 'refunded' && 'bg-red-100 text-red-800',
                        )}
                    >
                        {PAYMENT_STATUS.find(status => status.value === info.row.original.paymentStatus)?.label || 'Unknown'}
                    </Badge>
                    {isRepeatOrder && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                            Repeat Order
                        </Badge>
                    )}
                </div>
            );
        },
    }),
    columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: (info) =>
            info.getValue().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }),
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
            <div className="flex flex-col items-center gap-2">
                <SellerNote note={info.row.original.merchantNote} orderId={info.row.original.id}/>
                <CreateOrderSheet orderId={info.row.original.id}/>
                <TrackingDialog orderId={info.row.original.id}/>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="cursor-pointer">
                            More Actions
                            <ChevronDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onSelect={() => handleStatusUpdate(info.row.original.id, 'confirmed')}>
                                            Confirmed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleStatusUpdate(info.row.original.id, 'ready_to_ship')}>
                                            Ready To Ship
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem>Add Note</DropdownMenuItem>
                            <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <DropdownMenuItem>
                                New Team
                                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    }),
];

export default orderColumns;