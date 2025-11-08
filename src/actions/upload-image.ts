"use client";

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { toast } from "sonner";
import setImage from "@/actions/set-image";
import getImage from "@/actions/get-image";

// Authentication helper for ImageKit
const authenticator = async () => {
    try {
        const response = await fetch("/api/upload-auth");
        if (!response.ok) {
            const errorText = await response.text();
            toast.error(errorText || "Authentication failed");
        }

        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};

export default async function uploadImage({ image }: { image: File }) {
    try {
        // ✅ Generate hash for deduplication
        const hashBuffer = await crypto.subtle.digest("SHA-256", await image.arrayBuffer());
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        const serverImage = await getImage({ hash: hash });
        if(serverImage.length >= 1) {
            toast.success("Image uploaded successfully!");
            return serverImage[0].id;
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
                console.log("Upload progress:", (event.loaded / event.total) * 100, "%");
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

        toast.success("Image uploaded successfully!");
        return data[0].image_id;
    } catch (error) {
        if (error instanceof ImageKitAbortError) {
            toast.error("Upload aborted");
        } else if (error instanceof ImageKitInvalidRequestError) {
            toast.error("Invalid request");
        } else if (error instanceof ImageKitUploadNetworkError) {
            toast.error("Network error");
        } else if (error instanceof ImageKitServerError) {
            toast.error("Server error");
        } else {
            toast.error("Unknown error occurred during upload");
        }
        console.error("Upload error:", error);
    }
}
