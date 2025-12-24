import React from 'react';

const EditOrderPage = async (
    {params}: {params: Promise<{orderId: string}>}
) => {
    const {orderId} = await params

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{orderId}</h1>
        </div>
    );
};

export default EditOrderPage;
