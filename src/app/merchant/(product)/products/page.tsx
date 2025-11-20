import React, {Suspense} from 'react';

// Local
import ProductList from './product-table';

const ProductPage = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading products...</div>}>
                <ProductList />
            </Suspense>
        </div>
    );
};

export default ProductPage;