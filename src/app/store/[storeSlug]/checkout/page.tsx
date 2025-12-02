import React from 'react';

// Local
import OrderSummary from './order-summary';
import CheckoutForm from './checkout-form';

const CheckoutPage = () => {
    return (
        <div className='space-y-8 p-4 max-w-2xl mx-auto'>
            <OrderSummary/>
            <CheckoutForm/>
        </div>
    );
};

export default CheckoutPage;