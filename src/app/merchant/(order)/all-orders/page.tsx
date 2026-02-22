'use client';

import React, { useCallback, useState, useEffectEvent, useEffect } from 'react';
import { useSearchParams } from "next/navigation";

// Local
import OrderTable from './order-table';

// ShadCN
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Constant
import ORDER_STATUS from '@/constant/order-status';

const Page = () => {
    const tabs = [{value: "all-orders", label: "All Orders"}, ...ORDER_STATUS];
    const searchParams = useSearchParams();
    const status = searchParams.get('status') || 'all-orders'
    const [currentStatus, setCurrentStatus] = useState<string>(status);
    
    // const handlePopState = useEffectEvent(() => {
    //     setCurrentStatus(status);
    // });
    //
    // useEffect(() => {
    //     window.addEventListener('popstate', handlePopState);
    //     return () => {
    //         window.removeEventListener('popstate', handlePopState);
    //     };
    // }, []);
    //
    // const onStatusChange = useCallback((value: string) => {
    //     const params = new URLSearchParams(window.location.search);
    //     if (value === 'all-orders') {
    //         params.delete('status');
    //     } else {
    //         params.set('status', value);
    //     }
    //     const queryString = params.toString();
    //     const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
    //     window.history.pushState(null, '', newUrl);
    // }, []);

    return (
        <Tabs defaultValue={currentStatus}>
            <ScrollArea>
                <TabsList className="mb-4">
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value} className="whitespace-nowrap">
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    <OrderTable status={tab.value}/>
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default Page;