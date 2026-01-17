import React from 'react';
import { Button } from "@/components/ui/button";

const OrderButton = (
    {children}: {children: React.ReactNode}
) => {
    return (
        <Button size={'sm'} variant={'default'}>
            {children}
        </Button>
    );
};

export default OrderButton;