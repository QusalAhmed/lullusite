'use client'

import React, { useState } from 'react';
import Image from 'next/image'

// Local
import ImageZone from "@/components/image-zone"

// Type
import type { ImageZoneType } from "@/types/image-zone"

// Icon
import { X, RefreshCcw, CloudUpload, ImageUp, Upload } from "lucide-react";

// ShadCN
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"

// Action
import setProfilePicture from '@/actions/settings/set-profile-picture';

// Sonner
import { toast } from 'sonner';

const dropComponent = (
    <div className={'w-48 h-48 flex flex-col items-center justify-center cursor-crosshair'}>
        <ImageUp size={48} color={'rgba(114,114,114,0.5)'}/>
        <div className={'text-center text-gray-600'}>
            Drag and drop files here, or click to select files
        </div>
    </div>
)

const dragComponent = (
    <div className={'w-48 h-48 flex flex-col items-center justify-center cursor-crosshair'}>
        <Upload size={48} color={'rgba(114,114,114,0.5)'}/>
        <div className={'text-center text-gray-600'}>
            Drop the files here ...
        </div>
    </div>
)

const ProfilePicture = () => {
    const [images, setImages] = useState<ImageZoneType[]>([])

    React.useEffect(() => {
        console.log(images);

        // Set the last uploaded image as profile picture
        if (images[0]?.serverImageId) {
            setProfilePicture(images[0].serverImageId).then((response) => {
                console.log('Profile picture set:', response);
                if (response && response.length > 0) {
                    toast.success('Profile picture updated successfully!');
                }
            }).catch((error) => {
                console.error('Error setting profile picture:', error);
                toast.error('Failed to update profile picture.');
            });
        }
    }, [images])

    return (
        <div className={'space-y-3 mt-4'}>
            <div className={'flex items-center justify-center'}>
                <div className={'border-dashed border-2 border-gray-300 rounded-full p-2'}>
                    <ImageZone setImage={setImages} dropComponent={dropComponent} dragComponent={dragComponent}/>
                </div>
            </div>
            <aside>
                <div className={'flex items-start justify-start gap-2'}>
                    {images.length > 0 && images.map(image => (
                        <div key={image.imageId} className={'w-24 h-24 relative rounded-md overflow-hidden border'}>
                            <Button
                                variant={'destructive'}
                                size={'icon'}
                                className={'absolute top-1 right-1 z-10 rounded-full'}
                                onClick={() => {
                                    setImages((prevImages) => {
                                        // Revoke the object URL to free up memory
                                        URL.revokeObjectURL(image.preview);
                                        return prevImages.filter(img => img.imageId !== image.imageId);
                                    });
                                }}
                            >
                                <X/>
                            </Button>
                            <div className='absolute bottom-0 left-0 w-full bg-gray-400/80 text-xs text-center z-10 py-0.5'>
                                {image.status === 'uploading' && (
                                    <div className={'flex flex-col items-center justify-center'}>
                                        <Progress value={image.progress} className={'w-[90%] bg-white border-cyan-400'}/>
                                    </div>
                                )}
                                {image.status === 'uploaded' && (
                                    <div
                                        className='flex items-center justify-center gap-1 font-semibold animate-accordion-down animation-duration-700'>
                                        <CloudUpload size={16}/>
                                        Uploaded
                                    </div>
                                )}
                                {image.status === 'error' && (
                                    <span className={'text-red-700'}>Error</span>
                                )}
                                {image.status === 'pending' && (
                                    <div className={'flex items-center justify-center gap-1 font-semibold'}>
                                        <RefreshCcw size={12} className={'animate-spin'}/>
                                        Processing
                                    </div>
                                )}
                            </div>
                            <Image
                                src={image.preview}
                                alt={image.name || 'User Image'}
                                fill
                                className={'object-cover'}
                            />
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
};

export default ProfilePicture;