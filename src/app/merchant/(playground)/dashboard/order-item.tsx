import React from 'react';
import Image from "next/image";

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
        <ItemGroup>
            {data?.orderItems.map((item) => (
                <Item key={item.productVariationId} variant="outline" className="mb-2">
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
                    <ItemActions>
                        {item.totalQuantity}
                    </ItemActions>
                </Item>
            ))}
            <ItemSeparator />
        </ItemGroup>
    );
};

export default OrderItem;