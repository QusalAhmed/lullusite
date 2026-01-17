import React from "react";

// ShadCN
import { Button } from "@/components/ui/button";

const Toolbox = () => {
    return (
        <div className='grid grid-cols-1 gap-4 p-4'>
            <div>
                Drag to add
            </div>
            <div>
                <Button size={'sm'} variant={'outline'}>
                    Text
                </Button>
            </div>
        </div>
    )
};

export default Toolbox;