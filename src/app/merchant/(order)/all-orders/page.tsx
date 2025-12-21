import React from 'react';

// Local
import OrderTable from './order-table';

// ShadCN
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Page = () => {
    return (
        <>
            <section className="mb-4">
                <Tabs defaultValue="all-orders">
                    <TabsList>
                        <TabsTrigger value="all-orders">All Orders</TabsTrigger>
                        <TabsTrigger value="pending-orders">Pending Orders</TabsTrigger>
                        <TabsTrigger value="confirmed">Confirmed Order</TabsTrigger>
                        <TabsTrigger value="toship">To Ship</TabsTrigger>
                        <TabsTrigger value="shipping">Shipping</TabsTrigger>
                        <TabsTrigger value="delivered">Delivered</TabsTrigger>
                        <TabsTrigger value="partially-delivered">Partially Delivered</TabsTrigger>
                        <TabsTrigger value="returned">Returned</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancellation</TabsTrigger>
                        <TabsTrigger value="refund">Refunded</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all-orders">
                        <OrderTable/>
                    </TabsContent>
                    <TabsContent value="pending-orders">
                        <OrderTable status="pending"/>
                    </TabsContent>
                    <TabsContent value="confirmed">
                        <OrderTable status="confirmed"/>
                    </TabsContent>
                    <TabsContent value="toship">
                        <OrderTable status="ready_to_ship"/>
                    </TabsContent>
                    <TabsContent value="shipping">
                        <OrderTable status="shipped"/>
                    </TabsContent>
                    <TabsContent value="delivered">
                        <OrderTable status="delivered"/>
                    </TabsContent>
                    <TabsContent value="partially-delivered">
                        <OrderTable status="partially_delivered"/>
                    </TabsContent>
                    <TabsContent value="returned">
                        <OrderTable status="returned"/>
                    </TabsContent>
                    <TabsContent value="cancelled">
                        <OrderTable status="cancelled"/>
                    </TabsContent>
                    <TabsContent value="refund">
                        <OrderTable status="refunded"/>
                    </TabsContent>
                </Tabs>
            </section>
        </>
    );
};

export default Page;