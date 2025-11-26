'use client';

import React, { useRef } from 'react';
import { Exo_2 } from 'next/font/google'

// ShadCN
import { Button } from "@/components/ui/button";

// Local
import MyDropzone from '@/components/image-hub/ui';

const googleFont = Exo_2({
    weight: '400',
    subsets: ['latin'],
})

interface ReadyImage {
    serverImageId: string;
    previewURL: string;
    hash: string;
}

const Page = () => {
    const imagesRef = useRef<ReadyImage[]>([
        { serverImageId: 'img_001', previewURL: 'https://ik.imagekit.io/qusal/Screenshot_20251118-104330_3yM47L1GFI.png', hash: 'hash_001' },
        { serverImageId: 'img_002', previewURL: 'https://ik.imagekit.io/qusal/IMG_20241127_222942_212_hTcmRQiiK.jpg', hash: 'hash_002' },
        { serverImageId: 'img_003', previewURL: 'https://ik.imagekit.io/qusal/tr:n-ik_ml_thumbnail/S9330d79d39f040489e645a1a7214961eB_Ea7G-eVyY.jpg', hash: 'hash_003' },
    ]);

    return (
        <div className={googleFont.className}>
            <Button className="mb-4" onClick={() => {
                console.log('Ready Images:', imagesRef.current)
            }}>
                Log Ready Images
            </Button>
            <MyDropzone readyImagesRef={imagesRef} maxFiles={5}/>
        </div>
    );
};

export default Page;