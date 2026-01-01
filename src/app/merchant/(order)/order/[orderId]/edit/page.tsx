import React from 'react';

// Action
import getOrderToEdit from '@/actions/order/get-order-to-edit'

// Form
import OrderForm from "@/components/form/item/order-form"

const EditOrderPage = async (
    {params}: {params: Promise<{orderId: string}>}
) => {
    const {orderId} = await params
    const order = await getOrderToEdit(orderId)
    console.log(order)

    return (
        <section>
            <OrderForm formData={order} />
        </section>
    );
};

export default EditOrderPage;
