import React from 'react';
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

// Tanstack Query
import { useQuery } from "@tanstack/react-query"

const FraudReport = ({phoneNumber}: { phoneNumber: string }) => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['fraudReport', phoneNumber],
        queryFn: async () => {
            const response = await axios.get('https://fraudchecker.link/free-fraud-checker-bd/api/search.php', {
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
        return <div>Loading fraud report...</div>;
    }

    if (isError) {
        return null;
    }

    return (
        <>
            <div className="flex flex-col gap-1">
                <div>
                    Fraud Score:
                    <Badge variant={data.data.riskColor === 'success' ? 'outline' : 'destructive'} className="ml-2">
                        {data.data.totalDelivered} / {data.data.totalOrders}
                    </Badge>
                    <span className="ml-4 font-medium text-sm text-gray-700">
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
                            }) => (
                                <div key={courier.name} className="mb-2">
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

export default FraudReport;