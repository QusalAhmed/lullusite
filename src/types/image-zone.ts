interface ImageZoneType extends File {
    imageId: string;
    serverImageId?: string;
    preview: string;
    isUploaded: boolean;
    progress: number;
    byteLength: number;
    status: 'pending' | 'uploading' | 'uploaded' | 'error';
    identifier?: string;
}

export type { ImageZoneType };