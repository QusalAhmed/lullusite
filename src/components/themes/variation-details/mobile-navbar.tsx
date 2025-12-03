'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    icon: React.ElementType;
    label: string;
    href?: string;
    onClick?: () => void;
    badge?: number;
}


// Redux
import {useSelector} from "react-redux";
import type {RootState} from "@/lib/redux/store";

const MobileNavbar = ({ storeSlug }: { storeSlug: string }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const cartItems = useSelector((state: RootState) => state.cart.carts);
    const cartItemCount = cartItems.length

    const items: NavItem[] = [
        { icon: Home, label: 'Home', href: `/store/${storeSlug}` },
        { icon: ShoppingCart, label: 'Cart', href: `/store/${storeSlug}/cart`, badge: cartItemCount },
        { icon: User, label: 'Profile', href: `/store/${storeSlug}/profile` },
    ];
    const handleItemClick = (index: number, item: NavItem) => {
        setActiveIndex(index);
        if (item.onClick) {
            item.onClick();
        }
    };

    return (
        <nav
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50",
                "bg-background/95 backdrop-blur-sm border-t border-border",
                "md:hidden", // Hide on desktop
                "safe-area-inset-bottom"
            )}
        >
            <div className="flex items-center justify-around h-16 px-2">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeIndex === index;

                    const content = (
                        <>
                            <div className="relative">
                                <Icon
                                    className={cn(
                                        "w-6 h-6 transition-colors duration-200",
                                        isActive
                                            ? "text-primary"
                                            : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                />
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-medium transition-colors duration-200",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground group-hover:text-foreground"
                                )}
                            >
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-b-full" />
                            )}
                        </>
                    );

                    const className_shared = cn(
                        "flex flex-col items-center justify-center",
                        "flex-1 h-full gap-1",
                        "transition-all duration-200",
                        "relative group",
                        "active:scale-95"
                    );

                    if (item.href) {
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={() => handleItemClick(index, item)}
                                className={className_shared}
                                aria-label={item.label}
                                scroll={false}
                            >
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleItemClick(index, item)}
                            className={className_shared}
                            aria-label={item.label}
                        >
                            {content}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNavbar;