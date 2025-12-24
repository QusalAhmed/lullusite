'use client';

import React from 'react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import {cn} from "@/lib/utils";

// Icon
import { Heart } from "lucide-react";

// Animation
import { motion } from "framer-motion";

const MadeWith = () => {
    const isMobile = useIsMobile();

    return (
        <div className={cn("text-sm text-center text-muted-foreground mb-4", isMobile && "mb-20")}>
            Made with{' '}
            <motion.span
                className="inline-block"
                animate={{ scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            >
                <Heart className="inline-block mb-1 text-red-500" size={16} />
            </motion.span>
            {' '}by{' '}
            <Link href="https://www.lullusite.com" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                <span className={'font-semibold text-cyan-800 text-lg'}>Lullu Site</span>
            </Link>
            <div className='text-xs text-muted-foreground w-3/4 mx-auto'>
                <span className={'text-cyan-800 mr-1'}>Lullu Site</span>
                is a website builder that helps businesses to automate business, make website and grow online.
            </div>
        </div>
    );
};

export default MadeWith;