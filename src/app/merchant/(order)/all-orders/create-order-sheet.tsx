import React from 'react';

// ShadCN
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Spinner } from "@/components/ui/spinner"

// Hook
import { useIsMobile } from '@/hooks/use-mobile'

// Action
import getOrderToEdit from '@/actions/order/get-order-to-edit'

// Form
import OrderForm from "@/components/form/item/order-form"

// Tanstack Query
import { useQuery } from "@tanstack/react-query"

const CreateOrderSheet = ({orderId}: { orderId: string }) => {
    const {data: order, isLoading, isError} = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrderToEdit(orderId),
        enabled: !!orderId,
    });
    const isMobile = useIsMobile();

    function printOrder() {
        return (
            <div className="no-scrollbar overflow-y-auto p-4">
                {isLoading &&
                    <p className={'flex items-center gap-2 justify-center mb-4 text-lg font-medium'}>
                        <Spinner className={'size-8'}/> Loading...
                    </p>
                }
                {isError && <p>Error loading order.</p>}
                {order && <OrderForm formData={order}/>}
            </div>
        )
    }

    if (isMobile) {
        return (
            <Drawer direction="bottom">
                <DrawerTrigger asChild>
                    <Button variant={'default'} size={'sm'}>
                        View Order
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader hidden>
                        <DrawerTitle>View Order</DrawerTitle>
                        <DrawerDescription>View and edit order</DrawerDescription>
                    </DrawerHeader>
                    {printOrder()}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={'default'} size={'sm'}>
                    View Order
                </Button>
            </SheetTrigger>
            <SheetContent className={'overflow-y-auto p-4'}>
                <SheetHeader hidden>
                    <SheetTitle>View Order</SheetTitle>
                </SheetHeader>
            </SheetContent>
            {printOrder()}
        </Sheet>
    );
};

export default CreateOrderSheet;