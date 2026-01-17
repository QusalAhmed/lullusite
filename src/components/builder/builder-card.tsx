import React from 'react';

// Local
import Text from "./text";
import OrderButton from "./order-button";

// ShadCN
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const BuilderCard = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Text text={"Card Title"} fontSize={18} />
                </CardTitle>
                <CardDescription>Card Description</CardDescription>
                <CardAction>
                    <OrderButton>Order Now</OrderButton>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    );
};

export default BuilderCard;