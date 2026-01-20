'use client';

import React, { useEffectEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";

// Local
import OrderTable from './order-table';

// ShadCN
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Constant
import ORDER_STATUS from '@/constant/order-status';

const Page = () => {
    const tabs = [{value: "all-orders", label: "All Orders"}, ...ORDER_STATUS];
    const router = useRouter();
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
            <Tabs value={activeTab} onValueChange={(value) => {
                router.push(`/merchant/all-orders${value === 'all-orders' ? '' : `?status=${value}`}`)
            }}>
                <ScrollArea className="mb-2">
                    <TabsList className="bg-white px-1.5 py-1 rounded-md border border-gray-300">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white text-gray-700 rounded-md px-3 py-1.5 mr-2 whitespace-nowrap"
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