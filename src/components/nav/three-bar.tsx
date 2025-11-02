'use client'
import React, { useState } from 'react';

// Local
import MobileSheet from "@/components/nav/mobile-sheet";

// ShadCN
import { Button } from "@/components/ui/button";

// fn
import { cn } from '@/lib/utils'

const ThreeBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <MobileSheet setIsOpen={setIsOpen}>
                <Button className={cn("flex flex-col", isOpen ? "gap-0" : "gap-1")}
                        variant="ghost"
                >
                    <div className={cn('w-6 h-1 bg-current rounded-full', isOpen ? 'translate-y-1/2 rotate-45' : '')}></div>
                    <div className={cn('w-6 h-1 bg-current rounded-full', isOpen ? 'hidden' : '')}></div>
                    <div className={cn('w-6 h-1 bg-current rounded-full', isOpen ? '-translate-y-1/2 -rotate-45' : '')}></div>
                </Button>
            </MobileSheet>
        </div>
    );
};

export default ThreeBar;