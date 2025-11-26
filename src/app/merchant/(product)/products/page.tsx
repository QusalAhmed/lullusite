import React from 'react';
import Link from 'next/link';

// Local
import ProductTable from './product-table';

// ShadCN
import { Button } from '@/components/ui/button';

const ProductsPage = () => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
                <div>
                    <Link href="/merchant/add-product">
                        <Button variant="default">
                            Add New Product
                        </Button>
                    </Link>
                </div>
            </div>
            <ProductTable/>
        </div>
    );
};

export default ProductsPage;