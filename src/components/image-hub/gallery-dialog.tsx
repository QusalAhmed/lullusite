import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Local
import ImageHubGalleryWrapper from "@/components/image-hub/image-hub-gallery";

// Type
import { ReadyImage } from '@/types/image-hub';

const GalleryDialog = (
    {children, addImage}: { children: React.ReactNode, addImage: (readyImage: ReadyImage) => void }
) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" className={'cursor-pointer'}>
                        {children}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Image Gallery</DialogTitle>
                        <DialogDescription>
                            Browse and select images from your gallery
                        </DialogDescription>
                    </DialogHeader>
                    <ImageHubGalleryWrapper setIsOpen={setIsOpen} addImage={addImage} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default GalleryDialog;