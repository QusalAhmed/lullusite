import React, { Dispatch, SetStateAction, useCallback, useEffect, ReactNode } from 'react';
import Dropzone from 'react-dropzone';

// Type
import type { ImageZoneType } from "@/types/image-zone";

// Action
import uploadImage from './upload-image';

const ImageZone = (
    {setImage, dropComponent, dragComponent}: {
        setImage: Dispatch<SetStateAction<ImageZoneType[]>>,
        dropComponent: ReactNode,
        dragComponent: ReactNode
    }
) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newImages: ImageZoneType[] = acceptedFiles.map((file) =>
            Object.assign(file, {
                imageId: crypto.randomUUID(),  // ✅ unique id
                isUploaded: false,
                progress: 0,
                status: 'pending',
                byteLength: file.size,
                preview: URL.createObjectURL(file),
            } as ImageZoneType)
        );

        setImage((prevState) => [...prevState, ...newImages]);

        // Start upload for each image
        newImages.forEach(async (image) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setImage((prevState) =>
                prevState.map((img) =>
                    img.imageId === image.imageId ? {...img, status: 'uploading'} : img
                )
            );

            const response = await uploadImage({image, setImages: setImage});

            if (response.success) {
                setImage((prevState) =>
                    prevState.map((img) =>
                        img.imageId === image.imageId
                            ? {
                                ...img,
                                isUploaded: true,
                                status: 'uploaded',
                                serverImageId: response.imageId,
                                progress: 100,
                            }
                            : img
                    )
                );
            } else {
                setImage((prevState) =>
                    prevState.map((img) =>
                        img.imageId === image.imageId
                            ? {...img, status: 'error'}
                            : img
                    )
                );
            }
        });
    }, [setImage]);

    useEffect(() => {
        return () => {
            setImage((images) => {
                images.forEach((img) => URL.revokeObjectURL(img.preview));
                return [];
            });
        };
    }, [setImage]);


    return (
        <Dropzone onDrop={onDrop} accept={{'image/*': []}} maxFiles={1}>
            {({getRootProps, getInputProps, isDragActive}) => (
                <section>
                    <div
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? dragComponent : dropComponent}
                    </div>
                </section>
            )}
        </Dropzone>
    );
};

export default ImageZone;
