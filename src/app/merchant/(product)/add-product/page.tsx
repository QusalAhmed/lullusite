import React from 'react';
import Link from 'next/link';

// Local
import ProductForm from '@/components/product/product-form';


const AddProductPage = () => {
    return (
        <>
            <div className={'flex flex-col m-5'}>
                <h1 className="text-2xl font-bold flex justify-center">Add New Product</h1>
                <div className={'flex items-center justify-center'}>
                    If you need assistance, please refer to tutorial
                    <Link
                        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline p-2"
                    >
                        How to add a product
                    </Link>
                </div>
            </div>
            <ProductForm/>
        </>
    );
};

export default AddProductPage;