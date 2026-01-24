import React, {memo} from 'react';
import axios from 'axios';

// ShadCN
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import {Spinner} from "@/components/ui/spinner";

// Tanstack Query
import { useQuery } from "@tanstack/react-query"

const FraudReport = ({phoneNumber}: { phoneNumber: string }) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['fraudReport', phoneNumber],
        queryFn: async () => {
            const response = await axios.get('https://fraud-checker-proxy.qusalcse.workers.dev/', {
                params: {phone: phoneNumber}
            });
            return response.data;
        },
        enabled: !!phoneNumber,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    })
    console.log(data);

    if (isLoading) {
        return <div className={'text-gray-600 flex items-center gap-2'}><Spinner/>Loading fraud report...</div>;
    }

    if (isError) {
        return null;
    }

    if (!data || !data.data) {
        return <div className={'text-gray-600'}>No fraud data available.</div>;
    }

    return (
        <>
            <div className="flex flex-col gap-1">
                <div>
                    <div className='font-semibold text-gray-700'>Fraud Score:</div>
                    <Badge variant={data.data.riskColor === 'success' ? 'secondary' : 'destructive'} className="ml-2">
                        {data.data.totalDelivered} / {data.data.totalOrders}
                    </Badge>
                    <span className="ml-4 font-semibold text-sm text-gray-700">
                        {data.data.deliveryRate} %
                    </span>
                </div>
                <Progress value={data.data.deliveryRate} className="bg-red-500"/>
            </div>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-details">
                    <AccordionTrigger className="p-0 cursor-pointer text-cyan-800">Details</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <section>
                            {data.data.couriers.map((courier: {
                                orders: number;
                                delivered: number;
                                cancelled: number;
                                delivery_rate: string;
                                name: string;
                            }, index: number) => (
                                <div key={index} className="mb-2">
                                    {courier.orders > 0 && (
                                        <>
                                            <h4 className="font-semibold">{courier.name}</h4>
                                            <div className="ml-4">
                                                <div>Total Orders: <span className="font-bold">{courier.orders}</span></div>
                                                <div>Delivered: <span className="font-bold">{courier.delivered}</span></div>
                                                <div>Cancelled: <span className="font-bold">{courier.cancelled}</span></div>
                                                <div>Delivery Rate: <span className="font-bold">{courier.delivery_rate}</span></div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </section>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    );
};

export default memo(FraudReport);