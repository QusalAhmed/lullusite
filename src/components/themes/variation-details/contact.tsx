import React from 'react';
import Link from 'next/link';

// ShadCN
import {
    Item,
    ItemActions,
    ItemContent,
    ItemMedia,
    ItemTitle,
    ItemDescription,
} from "@/components/ui/item"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

// Icons
import {
    ChevronRightIcon,
    MailIcon,
    PhoneIcon,
    MessageCircleIcon,
    MapPinIcon,
} from "lucide-react"

const Contact = () => {
    const contactOptions = [
        {
            href: "mailto:hi@lullusite.com",
            title: "Email us",
            description: "We reply within 1 business day.",
            icon: MailIcon,
        },
        {
            href: "tel:+8801843557389",
            title: "Call us",
            description: "Anytime",
            icon: PhoneIcon,
        },
        {
            href: "https://wa.me/8801843557389",
            title: "Message on WhatsApp",
            description: "Quick questions? Chat with our team.",
            icon: MessageCircleIcon,
            newTab: true,
        },
        {
            href: "https://maps.google.com/?q=Bagha+Rajshahi",
            title: "Visit our studio",
            description: "Bagha Rajshahi — get directions",
            icon: MapPinIcon,
            newTab: true,
        },
    ]

    return (
            <Card className="m-4">
                <CardHeader>
                    <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {contactOptions.map(({ href, title, description, icon: Icon, newTab }) => (
                        <Item key={href} variant="outline" size="sm" asChild>
                            <Link
                                href={href}
                                target={newTab ? "_blank" : undefined}
                                rel={newTab ? "noreferrer" : undefined}
                            >
                                <ItemMedia variant="icon">
                                    <Icon className="size-5" />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle className={'text-lg'}>{title}</ItemTitle>
                                    <ItemDescription>{description}</ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <ChevronRightIcon className="size-4" />
                                </ItemActions>
                            </Link>
                        </Item>
                    ))}
                </CardContent>
            </Card>
    );
};

export default Contact;