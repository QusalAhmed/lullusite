import React, {useState} from 'react';
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

// Action
import toggleVariationStatus from '@/actions/product/toggle-variation-status';

const ProductStatus = (
    {isActive, variationId}: {isActive: boolean, variationId: string}
) => {
    const [status, setStatus] = useState(isActive);

    return (
        <>
            <Switch
                id={variationId}
                className={'data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-red-400 cursor-pointer'}
                checked={status}
                onCheckedChange={(checked) => {
                    toggleVariationStatus(variationId, checked)
                        .then(() => {
                            toast.success(`Product variation has been ${checked ? 'activated' : 'deactivated'}.`);
                            setStatus(status => !status);
                        })
                        .catch(() => {
                            toast.error('Failed to update product variation status.');
                        });
                }}
            />
        </>
    );
};

export default ProductStatus;