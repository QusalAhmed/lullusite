import {ReactNode} from 'react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'All Orders - Merchant Dashboard',
    description: 'View and manage all orders in your merchant dashboard.',
};

const OrderLayout = ({children}: {children: ReactNode}) => {
    return <section>{children}</section>
};

export default OrderLayout;