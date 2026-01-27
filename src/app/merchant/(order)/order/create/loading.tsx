import React from 'react';

// ShadCN
import { Spinner } from "@/components/ui/spinner"

const Loading = () => {
    return (
        <div className="flex items-center justify-center gap-4 py-10">
            <Spinner className="size-16" />
            <div className={'text-lg'}>Loading form...</div>
        </div>
    );
};

export default Loading;