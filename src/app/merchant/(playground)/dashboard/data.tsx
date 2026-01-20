import React from 'react';

// type
import { type DashboardData } from '@/actions/dashboard/get';

// ShadCN
import { Spinner } from "@/components/ui/spinner"
import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

// icon
import { FaBangladeshiTakaSign } from "react-icons/fa6";

function DataBlock({title, value, amount}: { title: string; value?: number, amount?: number }) {
    return (
        <Card className='hover:shadow-lg transition-shadow'>
            <CardHeader>
                <CardTitle><h1 className={'text-md text-gray-500'}>{title}</h1></CardTitle>
                {/*<CardDescription>Card Description</CardDescription>*/}
            </CardHeader>
            <CardContent className='flex justify-around items-baseline'>
                {value === undefined ? (
                    <Spinner className='size-8 text-gray-400'/>
                ) : (
                    <div className='text-4xl font-bold text-cyan-800 flex'>
                        {new Intl.NumberFormat("en-IN", {
                            trailingZeroDisplay: "stripIfInteger",
                            maximumFractionDigits: 2,
                        }).format(value)}
                    </div>
                )}
                {amount ? (
                    <div className='text-2xl font-normal text-cyan-900 flex gap-1'>
                        <FaBangladeshiTakaSign/>
                        {new Intl.NumberFormat("en-IN", {
                            trailingZeroDisplay: "stripIfInteger",
                            maximumFractionDigits: 2,
                        }).format(amount)}
                    </div>
                ) : null}
            </CardContent>
            {/*<CardFooter className='text-sm text-green-600'>*/}
            {/*    +20.1% from last month*/}
            {/*</CardFooter>*/}
        </Card>
    );
}

const DataPage = ({data}: { data?: DashboardData }) => {
    return (
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            <DataBlock
                title='Pending'
                value={data ? data.order.filter(row => row.shippingStatus === 'pending')[0]?.count || 0 : undefined}
                amount={data ? data.order.filter(row => row.shippingStatus === 'pending')[0]?.sum || 0 : undefined}
            />
            <DataBlock
                title='Confirmed'
                value={data ? data.order.filter(row => row.shippingStatus === 'confirmed')[0]?.count || 0 : undefined}
                amount={data ? data.order.filter(row => row.shippingStatus === 'confirmed')[0]?.sum || 0 : undefined}
            />
            <DataBlock
                title='Delivered'
                value={data ? data.order.filter(row => row.shippingStatus === 'delivered')[0]?.count || 0 : undefined}
                amount={data ? data.order.filter(row => row.shippingStatus === 'delivered')[0]?.sum || 0 : undefined}
            />
            <DataBlock
                title='Returned'
                value={data ? data.order.filter(row => row.shippingStatus === 'returned')[0]?.count || 0 : undefined}
            />
            <DataBlock title='New Products' value={data?.productsCount}/>
            <DataBlock title='New Customers' value={data?.customersCount}/>
            <DataBlock
                title='Sales'
                value={data ? data.order.reduce((acc, curr) =>
                    curr.shippingStatus === 'delivered' ? acc + Number(curr.sum || 0) : acc, 0
                ) : undefined}
            />
        </div>
    );
};

export default DataPage;