'use client';

import React, {useEffectEvent, useEffect} from 'react';
import {useRouter, useSearchParams} from "next/navigation";

// Local
import OrderTable from './order-table';

// ShadCN
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// Constant
import ORDER_STATUS from '@/constant/order-status';

const Page = () => {
    const tabs = [{ value: "all-orders", label: "All Orders" }, ...ORDER_STATUS];
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
            <ScrollArea className="mb-2">
                <div className="flex gap-2 mb-2 pb-2">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.value}
                            variant="outline"
                            size="sm"
                            className={activeTab === tab.value ? 'bg-secondary' : ''}
                            onClick={() => {
                                router.push(`/merchant/all-orders${tab.value === 'all-orders' ? '' : `?status=${tab.value}`}`)
                                setActiveTab(tab.value)
                            }}
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
};

export default Page;