import React from 'react';

// Icon
import { Bug } from "lucide-react";

// ShadCN
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";

const BugReport = () => {
    return (
        <Tooltip defaultOpen delayDuration={100}>
            <TooltipTrigger asChild>
                <Button variant="outline">
                    <Bug className="w-4 h-4"/>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Report Bug</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default BugReport;