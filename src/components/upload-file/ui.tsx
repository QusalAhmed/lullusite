'use client'
import React, { useCallback, useState, useEffect } from 'react'
import Image from 'next/image'

// Dropzone
import { useDropzone } from 'react-dropzone'

// Icon
import { X, Upload, LoaderCircle } from 'lucide-react';

// Sonner
import { toast } from 'sonner';

// Upload image
import uploadImage from "@/actions/upload-image"

// ShadCN
import { Button } from "@/components/ui/button"

// Pintura
// import '@pqina/pintura/pintura.css';
// import { openDefaultEditor } from '@pqina/pintura';

function nameLengthValidator(file: File) {
    const maxLength = 100;
    if (file.name?.length > maxLength) {
        toast.error(`File name ${file.name} is too long. Maximum length is ${maxLength} characters.`);

        return {
            code: "name-too-large",
            message: `Name is larger than ${maxLength} characters`
        };
    }

    return null
}

// const editImage = (image, done) => {
//     const imageFile = image.pintura ? image.pintura.file : image;
//     const imageState = image.pintura ? image.pintura.data : {};
//
//     const editor = openDefaultEditor({
//         src: imageFile,
//         imageState,
//     });
//
//     editor.on('close', () => {
//         // the user cancelled editing the image
//     });
//
//     editor.on('process', ({ dest, imageState }) => {
//         Object.assign(dest, {
//             pintura: { file: imageFile, data: imageState },
//         });
//         done(dest);
//     });
// };

function DropZone({maxFiles, setImageUrl}: {
    maxFiles?: number, setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [files, setFiles] = useState<(File & { preview: string; status: boolean })[]>([])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const uniqueAcceptedFiles = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
                status: false
            })
        )

        const validatedFiles = uniqueAcceptedFiles.filter(file => {
                // Check max files
                if (maxFiles && files.length + acceptedFiles.length > maxFiles) {
                    toast.error(`You can only upload up to ${maxFiles} files.`);
                    return false;
                }

                // Remove duplicate files
                if (files.find(f => f.name === file.name && f.size === file.size)) {
                    toast.error(`File ${file.name} is already added.`);
                    return false;
                }

                const fileSize = file.size / 1024 / 1024; // in MB
                if (fileSize > 2) {
                    toast.error(`File ${file.name} is too large. Maximum size is 2MB.`);
                    return false;
                }
                return true;
            }
        )

        setFiles(previousFiles => [
                ...previousFiles,
                ...validatedFiles
            ]
        );
        console.log('Dropped files:', acceptedFiles)

        // Upload to server
        validatedFiles.forEach(file => {
            uploadImage({image: file}).then(image_id => {
                if (image_id) {
                    setImageUrl(() => image_id);
                }

                setFiles(previousFiles =>
                    previousFiles.map(f =>
                        f.preview === file.preview ? {...f, status: true} : f
                    )
                );
            });
        })
    }, [files, maxFiles, setImageUrl])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: true,
        accept: {'image/*': ['.jpeg', '.png', '.gif', '.webp', '.jpg']},
        validator: nameLengthValidator
    })

    useEffect(
        () => () => {
            // Make sure to revoke the Object URL to avoid memory leaks
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return (
        <section>
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #ccc',
                    padding: 20,
                    textAlign: 'center',
                    cursor: 'pointer'
                }}
            >
                <input {...getInputProps()} />
                <div className={'select-none'}>{isDragActive ?
                    <div className={'flex flex-col items-center justify-center'}>
                        <p>Drop the files here ...</p>
                        <Upload size={72} color={'#727272'}/>
                    </div> :
                    'Drag and drop files here, or click to select files'}
                </div>
            </div>

            {files.length > 0 && (
                <aside className="mt-6">
                    <strong className="block mb-3 text-gray-700 dark:text-gray-200">
                        Selected files
                    </strong>
                    <div className="flex flex-wrap gap-4">
                        {files.map(file => (
                            <div key={file.preview} className="relative w-24 h-24">
                                {/* Remove button */}
                                <Button
                                    variant='destructive'
                                    size='sm'
                                    onClick={() => {
                                        setFiles(prev => (
                                            prev.filter(f => f.preview !== file.preview)
                                        ))
                                        setImageUrl(() => '');
                                        URL.revokeObjectURL(file.preview)
                                    }}
                                    className="absolute top-1 right-1 z-10 rounded-full cursor-pointer"
                                >
                                    <X size={12}/>
                                </Button>

                                {/* Loader */}
                                {!file.status && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg z-10">
                                        <LoaderCircle size={32} className="animate-spin text-white"/>
                                    </div>
                                )}

                                {/* Image preview */}
                                <Image
                                    src={file.preview}
                                    alt={file.name}
                                    width={100}
                                    height={100}
                                    className="object-cover w-24 h-24 rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                            </div>
                        ))}
                    </div>
                </aside>
            )}
        </section>
    )
}

export default DropZone