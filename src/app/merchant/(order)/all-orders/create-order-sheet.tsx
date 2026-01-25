import React from 'react';

// ShadCN
import {Button} from "@/components/ui/button"
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

// Hook
import {useIsMobile} from '@/hooks/use-mobile'

// Action
import getOrderToEdit from '@/actions/order/get-order-to-edit'

// Form
import OrderForm from "@/components/form/item/order-form"

// Tanstack Query
import {useQuery} from "@tanstack/react-query"

const CreateOrderSheet = ({orderId}: {orderId: string}) => {
    const {data: order} = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrderToEdit(orderId),
        enabled: !!orderId,
    });
    const isMobile = useIsMobile();

    if(isMobile) {
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
                    <div className="no-scrollbar overflow-y-auto px-4">
                        <OrderForm formData={order} />
                    </div>
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
                <OrderForm formData={order} />
            </SheetContent>
        </Sheet>
    );
};

export default CreateOrderSheet;