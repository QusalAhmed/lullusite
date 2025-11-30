'use client';

import React, { useState, Dispatch } from 'react';
import Image from 'next/image';

// ShadCN
import { Button } from '@/components/ui/button';
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    useQuery,
    keepPreviousData,
} from '@tanstack/react-query'


// fetch function
import getImages from '../../actions/image/get-images'

// Type
import type { GetImagesType } from '@/actions/image/get-images'
import { ReadyImage } from '@/types/image-hub';

// Icon
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';

const ImageHubGallery = (
    {setIsOpen, addImage}: { setIsOpen: Dispatch<boolean>, addImage: (readyImage: ReadyImage) => void }
) => {
    const limit = 30
    const [offset, setOffset] = useState(0)

    const {isPending, isError, data, error, isPlaceholderData} = useQuery({
        queryKey: ['images', {limit, offset}],
        queryFn: () => getImages(limit, offset),
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    })

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner className={'size-8'}/>
            </div>
        )
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <>
            <ScrollArea className="h-[70vh] w-full">
                <div className="columns-3 sm:columns-4 lg:columns-5 gap-4 relative p-4">
                    {data?.map((image: GetImagesType[number]) => (
                        <div key={image.id} className="mb-4 break-inside-avoid">
                            <Image
                                src={image.thumbnailUrl}
                                alt={image.altText}
                                width={image.width}
                                height={image.height}
                                className="object-cover rounded-lg cursor-pointer hover:opacity-80"
                                onClick={() => {
                                    addImage({
                                        serverImageId: image.id,
                                        previewURL: image.thumbnailUrl,
                                        hash: image.hash,
                                    })
                                    setIsOpen(false);
                                }}
                            />
                        </div>
                    ))}
                    {isPlaceholderData && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                            <Spinner className={'size-8'}/>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="flex justify-center space-x-4">
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={offset === 0 || isPlaceholderData}
                >
                    <CircleChevronLeft/>
                </Button>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setOffset(offset + limit)}
                    disabled={data && data.length < limit || isPlaceholderData}
                >
                    <CircleChevronRight/>
                </Button>
            </div>
        </>
    );
};

export default ImageHubGallery;