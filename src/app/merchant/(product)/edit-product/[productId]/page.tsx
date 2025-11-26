import React from 'react';
import Link from 'next/link';

// Local
import ProductForm from '@/components/product/product-form';

// Action
import getProduct from '@/actions/product/get-product';


const AddProductPage = async (
    { params }: { params: Promise<{ productId: string }> }
) => {
    const { productId } = await params;
    const product = await getProduct(productId);
    console.log('Fetched product for editing:', product);

    return (
        <>
            <div className={'flex flex-col mb-5'}>
                <h1 className="text-3xl font-bold flex justify-center text-cyan-600">
                    Edit Product
                </h1>
                <div className={'flex items-center justify-center text-sm'}>
                    If you need assistance, please refer to tutorial
                    <Link
                        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 underline p-2"
                    >
                        How to edit product
                    </Link>
                </div>
            </div>
            <ProductForm product={product}/>
        </>
    );
};

export default AddProductPage;