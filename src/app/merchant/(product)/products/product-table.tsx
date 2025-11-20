import React from 'react';

// Actions
import getProducts from '@/actions/product/get-products';

const ProductTable = async () => {
    const products = await getProducts();
    console.log(products);

    return (
        <div>

        </div>
    );
};

export default ProductTable;