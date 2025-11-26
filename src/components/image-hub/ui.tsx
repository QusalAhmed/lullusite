'use client'

import React, { useCallback, useState, useEffect } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { toast } from "sonner";

// Local
import { Button } from "@/components/ui/button";
import uploadImage from '@/actions/upload-image';

// Local
import ImageDialog from "@/components/image-hub/image-dialog";

// Icon
import { X, AlertCircleIcon, UploadCloud, Plus } from "lucide-react";

// ShadCN
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Spinner } from "@/components/ui/spinner"

interface ImageFile {
    file?: File;
    hash: string;
    preview: string;
    serverInfo?: {
        serverImageId?: string;
        progress: number;
        status: 'pending' | 'uploading' | 'uploaded' | 'error';
    };
}

interface ReadyImage {
    serverImageId: string;
    hash: string;
    previewURL: string;
}


function MyDropzone(
    {readyImagesRef, maxFiles}: { readyImagesRef: React.RefObject<ReadyImage[]>, maxFiles?: number }
) {
    const [files, setFiles] = useState<ImageFile[]>([]);

    console.log('rendered dropzone');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (maxFiles) {
            if (files.length + acceptedFiles.length > maxFiles) {
                toast.error(`You can only upload up to ${maxFiles} images.`);
                return;
            }
        }

        acceptedFiles.forEach((file: File) => {
            const reader = new FileReader();

            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = async () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

                // check duplicates against the *latest* state
                if (files.some(f => f.hash === hash)) {
                    console.log(`Duplicate file detected: ${file.name}`);
                    return;
                }

                setFiles(prevFiles => {
                    const fileWithMeta = Object.assign(file, {
                        file: file,
                        preview: URL.createObjectURL(file),
                        hash,
                        serverInfo: {
                            progress: 0,
                            status: 'pending' as const,
                        },
                    });

                    return [...prevFiles, fileWithMeta];
                });

                // Upload
                uploadImage({image: file, hash, setFiles}).then((response) => {
                    if (response.success) {
                        const message = response.message;
                        const imageId = response.imageId;
                        const previewURL = response.previewURL;

                        console.log(`Upload success: ${message}, Image ID: ${imageId}`);

                        if (imageId && previewURL) {
                            readyImagesRef.current = [
                                ...(readyImagesRef.current || []),
                                {
                                    serverImageId: imageId,
                                    previewURL: previewURL,
                                    hash,
                                },
                            ];

                            setFiles(prevFiles => {
                                return prevFiles.map(f => {
                                    if (f.hash === hash) {
                                        return {
                                            ...f,
                                            serverInfo: {
                                                serverImageId: imageId,
                                                progress: 100,
                                                status: 'uploaded' as const,
                                            },
                                        };
                                    }
                                    return f;
                                })
                            })
                        }
                    }
                }).catch((error) => {
                    console.error('Upload error:', error);
                });
            };

            reader.readAsArrayBuffer(file);
        });
    }, [files, maxFiles, readyImagesRef]);

    const {getRootProps, getInputProps, isDragActive, fileRejections} = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
        },
        maxSize: 5 * 1024 * 1024, // 2 MB
        // validator: (file) => {
        //     if (file.size > 2 * 1024 * 1024) {
        //         return {
        //             code: "file-too-large",
        //             message: "File is larger than 2 MB",
        //         };
        //     }
        //     return null;
        // },
    })

    const fileRejectionItems = fileRejections.map(({file, errors}) => (
        <li key={file.path} className={'gap-2 mb-2'}>
            <Alert variant="destructive">
                <AlertCircleIcon/>
                <AlertTitle>{file.path} - {file.size} bytes</AlertTitle>
                <AlertDescription>
                    <ul className="list-inside list-disc text-sm">
                        {errors.map((e, index) => (
                            <li key={e.code + index}>{e.message}</li>
                        ))}
                    </ul>
                </AlertDescription>
            </Alert>
        </li>
    ));

    useEffect(() => {
        console.log('Current file', files)
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    const removeImage = (fileToRemove: ImageFile) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
        URL.revokeObjectURL(fileToRemove.preview);

        // Remove from readyImagesRef as well
        if (readyImagesRef.current) {
            readyImagesRef.current = readyImagesRef.current.filter(
                (readyImage) => readyImage.hash !== fileToRemove.hash
            );
        }
    };

    useEffect(() => {
        setFiles(() => {
            const defaultFiles: ImageFile[] = readyImagesRef.current?.map((readyImage) => ({
                hash: readyImage.hash,
                preview: readyImage.previewURL,
                serverInfo: {
                    serverImageId: readyImage.serverImageId,
                    progress: 100,
                    status: 'uploaded' as const,
                },
            })) || [];
            return [...defaultFiles];
        });
    }, [readyImagesRef]);


    return (
        <div>
            <div {...getRootProps()}
                 className={'w-full h-28 border-2 border-dashed flex items-center justify-center rounded-md p-4 bg-gray-100 cursor-pointer'}>
                <input {...getInputProps()} />
                {isDragActive ?
                    <div className="flex flex-col items-center text-gray-600">
                        <div className={'flex justify-center'}><Plus size={48}/></div>
                        <div>Drop the images here ...</div>
                    </div> :
                    <div className="flex flex-col items-center text-gray-600">
                        <div className={'flex justify-center'}><UploadCloud size={48}/></div>
                        <div>Drag and drop some images here, or click to select images</div>
                    </div>
                }
            </div>
            <aside>
                <h4 className="mt-4 mb-2 font-semibold">File Preview</h4>
                <div className="flex flex-wrap">
                    {files.map((file) => (
                        <div key={file.hash} className="p-2 rounded wrap-anywhere">
                            <ImageDialog imageSrc={file.preview} imageAlt='Preview Image'>
                                <div className="relative">
                                    <Image
                                        src={file.preview}
                                        alt='Preview Image'
                                        width={80}
                                        height={80}
                                        loading="eager"
                                        className="object-cover mb-2 rounded-md overflow-hidden cursor-zoom-in"
                                    />
                                    {file.serverInfo?.status === 'uploading' && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
                                            <div className="flex flex-col items-center">
                                                <Spinner className="text-white size-8 mb-2"/>
                                                <div className="text-white text-sm">
                                                    {file.serverInfo?.progress}%
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {file.serverInfo?.status === 'pending' && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
                                            <Spinner className={'size-8 text-white'} />
                                        </div>
                                    )}
                                    {file.serverInfo?.status === 'error' && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                                            <AlertCircleIcon className="text-rose-500 size-6"/>
                                        </div>
                                    )}
                                    <div className="absolute top-0 right-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full cursor-pointer"
                                            onClick={() => {
                                                removeImage(file)
                                            }}
                                        >
                                            <X color={'red'}/>
                                        </Button>
                                    </div>
                                </div>
                            </ImageDialog>
                        </div>
                    ))}
                </div>
                {fileRejectionItems.length > 0 && (
                    <div className="mt-2">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="errors">
                                <AccordionTrigger>
                                    <div className={'text-red-700 font-bold text-lg'}>File upload errors</div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul>{fileRejectionItems}</ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )}
            </aside>
        </div>
    )
}

export default MyDropzone;