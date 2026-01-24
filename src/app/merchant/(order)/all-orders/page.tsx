'use client';

import React, { useEffectEvent, useEffect } from 'react';
import { useSearchParams } from "next/navigation";

// Local
import OrderTable from './order-table';

// ShadCN
// import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Constant
import ORDER_STATUS from '@/constant/order-status';

const Page = () => {
    const tabs = [{value: "all-orders", label: "All Orders"}, ...ORDER_STATUS];
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'all-orders'
    const [activeTab, setActiveTab] = React.useState(status);

    const setStatus = useEffectEvent(() => {
        setActiveTab(status);
    });
    useEffect(() => {
        setStatus();
    }, [status]);

    return (
        <>
            <Tabs defaultValue={activeTab} onValueChange={(value) => {
                window.history.pushState(null, '', `/merchant/all-orders?status=${value}`);
                setActiveTab(value);
            }}>
                <ScrollArea className="h-12">
                    <TabsList>
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="cursor-pointer whitespace-nowrap"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
                <TabsContent value={activeTab}>
                    <OrderTable status={activeTab === 'all-orders' ? undefined : activeTab}/>
                </TabsContent>
            </Tabs>
        </>
    )
};

export default Page;