import React from 'react';

// Local
import Cart from './cart'

const CartPage = async ({params}: {params: Promise<{ storeSlug: string }>}) => {
    const {storeSlug} = await params;

    return (
        <>
            <Cart storeSlug={storeSlug}/>
        </>
    );
};

export default CartPage;