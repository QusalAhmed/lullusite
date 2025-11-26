import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import setImage from "@/actions/category/set-image";
import getImage from "@/actions/category/get-image";
import React, { SetStateAction } from "react";


// Authentication helper for ImageKit
const authenticator = async () => {
    try {
        const response = await fetch("/api/upload-auth");
        if (!response.ok) {
            const errorText = await response.text();
            return Promise.reject(new Error(`Authentication failed: ${errorText}`));
        }

        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};

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

export default async function uploadImage(
    { image, hash, setFiles }: { image: File, hash: string, setFiles: React.Dispatch<SetStateAction<ImageFile[]>> }
) {
    try {
        // ✅ Check if image with the same hash already exists
        const serverImage = await getImage({ hash: hash });
        if(serverImage.length >= 1) {
            return {
                success: true,
                message: "Image already exists",
                imageId: serverImage[0].id,
                previewURL: serverImage[0].thumbnailUrl,
            }
        }

        // ✅ Authenticate with ImageKit
        const { signature, expire, token, publicKey } = await authenticator();

        // ✅ Upload to ImageKit
        const uploadResponse = await upload({
            expire,
            token,
            signature,
            publicKey,
            file: image,
            fileName: image.name,
            onProgress: (event) => {
                setFiles((prevState) =>
                    prevState.map((img) =>
                        img.hash === hash
                            ? {
                                ...img,
                                serverInfo: {
                                    ...img.serverInfo,
                                    progress: Math.round((event.loaded / event.total) * 100),
                                    status: 'uploading',
                                },
                            }
                            : img
                    )
                );
            },
        });

        console.log("Upload successful:", uploadResponse);

        // ✅ Serialize response (plain object)
        const plainUpload = JSON.parse(JSON.stringify(uploadResponse));

        // ✅ Save to DB via server action
        const data = await setImage({
            url: plainUpload.url,
            thumbnailUrl: plainUpload.thumbnailUrl,
            name: plainUpload.name,
            width: plainUpload.width,
            height: plainUpload.height,
            size: plainUpload.size,
            hash,
        });

        return {
            success: true,
            message: "Image uploaded successfully",
            imageId: data[0].image_id,
            previewURL: plainUpload.thumbnailUrl,
        }
    } catch (error) {
        if (error instanceof ImageKitAbortError) {
            return { success: false, message: "Upload aborted by user" };
        } else if (error instanceof ImageKitInvalidRequestError) {
            return { success: false, message: "Invalid upload request" };
        } else if (error instanceof ImageKitUploadNetworkError) {
            return { success: false, message: "Network error during upload" };
        } else if (error instanceof ImageKitServerError) {
            return { success: false, message: "Server error during upload" };
        } else {
            return { success: false, message: "An unexpected error occurred" };
        }
    }
}
