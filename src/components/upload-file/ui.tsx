'use client'
import React, { useCallback, useState } from 'react'
import Image from 'next/image'

// Dropzone
import { useDropzone } from 'react-dropzone'

// Icon
import { X, Upload } from 'lucide-react';

// Sonner
import { toast } from 'sonner';

function DropZone(props: {maxFiles?: number}) {
    const [files, setFiles] = useState<(File & { preview: string; })[]>([])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const validatedFiles = acceptedFiles.filter(file => {
                // Check max files
                if (props.maxFiles && files.length + acceptedFiles.length > props.maxFiles) {
                    toast.error(`You can only upload up to ${props.maxFiles} files.`);
                    return false;
                }
            
                // Remove duplicate files
                if (files.find(f => f.name === file.name && f.size === file.size)) {
                    toast.error(`File ${file.name} is already added.`);
                    return false;
                }

                const fileSize = file.size / 1024 / 1024; // in MB
                if (fileSize > 1) {
                    toast.error(`File ${file.name} is too large. Maximum size is 1MB.`);
                    return false;
                }
                return true;
            }
        )

        setFiles(previousFiles => [
                ...previousFiles,
                ...validatedFiles.map(file => Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                )
            ]
        );
        console.log('Dropped files:', acceptedFiles)
    }, [files, props.maxFiles])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: true,
        accept: {'image/*': ['.jpeg', '.png', '.gif', '.webp', '.jpg']}
    })

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
                <aside style={{marginTop: 12}}>
                    <strong>Selected files</strong>
                    <div style={{display: 'flex', flexWrap: 'wrap', marginTop: 12}}>
                        {files.map((file) => (
                            <div key={file.preview} style={{marginRight: 8, marginBottom: 8, position: 'relative'}}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFiles(previousFiles => previousFiles.filter(
                                            (f) => f.preview !== file.preview)
                                        )
                                        URL.revokeObjectURL(file.preview)
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        background: 'rgba(0,0,0,0.5)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 20,
                                        height: 20,
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 1
                                    }}
                                >
                                    <X size={12}/>
                                </button>
                                <Image
                                    src={file.preview}
                                    alt={file.name}
                                    width={100}
                                    height={100}
                                    style={{objectFit: 'cover', borderRadius: 8}}
                                />
                                <p style={{textAlign: 'center', maxWidth: 100, wordBreak: 'break-all'}}>{file.name}</p>
                            </div>
                        ))}
                    </div>
                </aside>
            )}
        </section>
    )
}

export default DropZone