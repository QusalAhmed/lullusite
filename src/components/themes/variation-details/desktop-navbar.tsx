import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Actions
import getBusinessInfo from "@/actions/store/get-business-info";

// Icon
import { BaggageClaim, UserRound } from 'lucide-react'

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Redux
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux/store';

// ShadCN
import { Badge } from "@/components/ui/badge"

const DesktopNavbar = ({storeSlug}: { storeSlug: string }) => {
    const {data, isPending} = useQuery({
        queryKey: ['business-information', storeSlug],
        queryFn: () => getBusinessInfo(),
        staleTime: Infinity,
    });
    const cartItems = useSelector((state: RootState) => state.cart.carts);

    return (
        <nav className="sticky top-0 z-10 flex w-full items-center justify-around mb-4">
            {isPending ? (
                <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"/>
            ) : data ? (
                <Link href={`/store/${storeSlug}`} className="flex items-center gap-2" scroll={false}>
                    <Image
                        src={data.logoImage?.thumbnailUrl || '/placeholder.png'}
                        alt={data.logoImage?.altText || 'Store Logo'}
                        width={40}
                        height={40}
                        className="object-contain rounded"
                    />
                    <span className="font-bold text-lg">{data?.businessName}</span>
                </Link>
            ) : (
                <div className="w-24 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Logo</span>
                </div>
            )}
            <div className="flex items-center gap-6">
                <Link href={`/store/${storeSlug}/cart`}
                      className={'flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded'}
                      scroll={false}
                >
                    <BaggageClaim size={18}/>
                    Cart
                    {cartItems.length > 0 && (
                        <Badge
                            variant="destructive"
                            className='absolate top-0 right-0'
                        >
                            {cartItems.length}
                        </Badge>
                    )}
                </Link>
                <Link href={`/store/${storeSlug}/profile`}
                      className={'flex items-center gap-2 cursor-pointer  hover:bg-gray-100 px-2 rounded'}
                      scroll={false}
                >
                    <div className={'p-1 border-2 rounded-full'}><UserRound size={18}/></div>
                    Account
                </Link>
            </div>
        </nav>
    );
};

export default DesktopNavbar;