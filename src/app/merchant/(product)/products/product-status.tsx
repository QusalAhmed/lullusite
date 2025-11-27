import React, {useState} from 'react';
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner"

// Action
import toggleVariationStatus from '@/app/merchant/(product)/products/toggle-variation-status';

const ProductStatus = (
    {isActive, variationId}: {isActive: boolean, variationId: string}
) => {
    const [status, setStatus] = useState(isActive);
    const [disabled, setDisabled] = useState(false);

    return (
        <div className='relative'>
            {disabled && (
                <div className='absolute z-10 left-50% top-50% translate-x-1/2'>
                    <Spinner />
                </div>
            )}
            <Switch
                id={variationId}
                className={'data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-red-400 cursor-pointer'}
                checked={status}
                disabled={disabled}
                onCheckedChange={(checked) => {
                    setDisabled(true);
                    toggleVariationStatus(variationId, checked)
                        .then(() => {
                            toast.success(`Product variation has been ${checked ? 'activated' : 'deactivated'}.`);
                            setDisabled(false);
                            setStatus(status => !status);
                        })
                        .catch(() => {
                            toast.error('Failed to update product variation status.');
                            setDisabled(false);
                        });
                }}
            />
        </div>
    );
};

export default ProductStatus;