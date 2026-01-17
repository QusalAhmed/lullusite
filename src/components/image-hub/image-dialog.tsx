import React from 'react';
import Image from 'next/image';

// ShadCN
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"

const ImageDialog = (
    {children, imageSrc, imageAlt}: { children: React.ReactNode, imageSrc: string, imageAlt: string }
) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="cursor-zoom-in">
                    {children}
                </div>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden max-w-3xl max-h-[80vh]">
                <DialogTitle className="sr-only">{imageAlt}</DialogTitle>
                <DialogDescription className="w-full h-full flex justify-center items-center">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width={600}
                        height={600}
                        className="object-fit max-w-full"
                    />
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export default ImageDialog;