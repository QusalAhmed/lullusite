import React, { useState } from 'react';

// ShadCN
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
import ImageHubGallery from "@/components/image-hub/image-hub-gallery";


// Actions
import { getImageSize, getImagesCount } from "@/actions/image/get-images";

// Type
import { ReadyImage } from '@/types/image-hub';

const GalleryDialog = (
    {children, addImage}: { children: React.ReactNode, addImage: (readyImage: ReadyImage) => void }
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSize, setImageSize] = useState<number | null>(null);
    const [imageCount, setImageCount] = useState<number | null>(null);

    // Fetch image size and count when dialog opens
    React.useEffect(() => {
        if (isOpen) {
            getImageSize().then(size => setImageSize(parseInt(size.toString())));
            getImagesCount().then(count => setImageCount(count));
        }
    }, [isOpen]);

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
                        <DialogTitle>
                            Image Gallery
                            {imageCount !== null && (
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    ({imageCount} images{imageSize !== null ? `, ${(imageSize / (1024 * 1024)).toFixed(2)} MB` : ''})
                                </span>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Select an image from your gallery to insert.
                        </DialogDescription>
                    </DialogHeader>
                    <ImageHubGallery setIsOpen={setIsOpen} addImage={addImage}/>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default GalleryDialog;