import React from 'react';
// import Image from "next/image";

// Types
import type { DashboardData } from "@/actions/dashboard/get";

// ShadCN
import {
    Item,
    ItemGroup,
    ItemSeparator,
    ItemContent,
    ItemDescription,
    ItemActions,
    ItemHeader,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"

const OrderItem = ({data}: { data?: DashboardData }) => {
    return (
        <ItemGroup className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.orderItems.map((item) => (
                <Item key={item.productVariationId} variant="outline">
                    <ItemMedia>
                        {/*<Image*/}
                        {/*    src={item.thumbnailUrl}*/}
                        {/*    alt={item.variationName}*/}
                        {/*    width={48}*/}
                        {/*    height={48}*/}
                        {/*    className="rounded-md object-cover"*/}
                        {/*/>*/}
                    </ItemMedia>
                    <ItemContent>
                        <ItemHeader>
                            <ItemTitle>{item.variationName}</ItemTitle>
                        </ItemHeader>
                        <ItemDescription>
                            Variation: {item.variationName}
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions className="font-semibold text-cyan-800 text-xl">
                        {item.totalQuantity}
                    </ItemActions>
                </Item>
            ))}
            <ItemSeparator />
        </ItemGroup>
    );
};

export default OrderItem;