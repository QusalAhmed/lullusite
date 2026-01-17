'use client';

import React from 'react';

// Local
import OrderTable from './order-table';

// ShadCN
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// Constant
import ORDER_STATUS from '@/constant/order-status';

const Page = () => {
    const [activeTab, setActiveTab] = React.useState("all-orders");
    const tabs = [{ value: "all-orders", label: "All Orders" }, ...ORDER_STATUS];

    return (
        <>
            <ScrollArea className="mb-2">
                <div className="flex gap-2 mb-2 pb-2">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.value}
                            variant="outline"
                            size="sm"
                            className={activeTab === tab.value ? 'bg-secondary' : ''}
                            onClick={() => setActiveTab(tab.value)}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
            <OrderTable status={activeTab === 'all-orders' ? undefined : activeTab}/>
        </>
    )

    // return (
    //     <>
    //         <section className="mb-4">
    //             <Tabs defaultValue="all-orders">
    //                 <TabsList className="overflow-x-auto">
    //                     <TabsTrigger value="all-orders">All Orders</TabsTrigger>
    //                     <TabsTrigger value="pending-orders">Pending Orders</TabsTrigger>
    //                     <TabsTrigger value="confirmed">Confirmed Order</TabsTrigger>
    //                     <TabsTrigger value="toship">To Ship</TabsTrigger>
    //                     <TabsTrigger value="shipping">Shipping</TabsTrigger>
    //                     <TabsTrigger value="delivered">Delivered</TabsTrigger>
    //                     <TabsTrigger value="partially-delivered">Partially Delivered</TabsTrigger>
    //                     <TabsTrigger value="returned">Returned</TabsTrigger>
    //                     <TabsTrigger value="cancelled">Cancellation</TabsTrigger>
    //                     <TabsTrigger value="refund">Refunded</TabsTrigger>
    //                 </TabsList>
    //                 <TabsContent value="all-orders">
    //                     <OrderTable/>
    //                 </TabsContent>
    //                 <TabsContent value="pending-orders">
    //                     <OrderTable status="pending"/>
    //                 </TabsContent>
    //                 <TabsContent value="confirmed">
    //                     <OrderTable status="confirmed"/>
    //                 </TabsContent>
    //                 <TabsContent value="toship">
    //                     <OrderTable status="ready_to_ship"/>
    //                 </TabsContent>
    //                 <TabsContent value="shipping">
    //                     <OrderTable status="shipped"/>
    //                 </TabsContent>
    //                 <TabsContent value="delivered">
    //                     <OrderTable status="delivered"/>
    //                 </TabsContent>
    //                 <TabsContent value="partially-delivered">
    //                     <OrderTable status="partially_delivered"/>
    //                 </TabsContent>
    //                 <TabsContent value="returned">
    //                     <OrderTable status="returned"/>
    //                 </TabsContent>
    //                 <TabsContent value="cancelled">
    //                     <OrderTable status="cancelled"/>
    //                 </TabsContent>
    //                 <TabsContent value="refund">
    //                     <OrderTable status="refunded"/>
    //                 </TabsContent>
    //             </Tabs>
    //         </section>
    //     </>
    // );
};

export default Page;