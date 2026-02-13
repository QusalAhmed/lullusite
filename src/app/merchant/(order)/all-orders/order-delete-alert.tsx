import React, {useState} from 'react';

// ShadCN
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";

// React Query
import {useMutation, useQueryClient} from "@tanstack/react-query";

// Action
import deleteOrder from "@/actions/order/delete-order";

const OrderDeleteAlert = ({orderId}: { orderId: string[] }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {mutate} = useMutation({
        mutationFn: () => deleteOrder(orderId),
        onMutate: () => {
            setIsLoading(true);
        },
        onSuccess: async (data) => {
            if (data.success) {
                toast.success(data.message);
                setIsOpen(false);
                await queryClient.invalidateQueries({queryKey: ['orders']});
            } else {
                toast.error(data.message);
            }
            setIsLoading(false);
        },
        onError: () => {
            toast.error('Failed to delete order. Please try again.');
            setIsLoading(false)
        }
    });
    const queryClient = useQueryClient();

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">Delete Order</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your order
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={() => mutate()} disabled={isLoading}>
                        {isLoading ? <Spinner /> : ''}
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default OrderDeleteAlert;