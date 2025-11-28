import React, {memo} from 'react';

// Local
import MyImageHub from './ui';
import { ReadyImage } from "@/types/image-hub";

const ImageHub = memo((
    {readyImagesRef, maxFiles, groupId}: { readyImagesRef: React.RefObject<ReadyImage[]>, maxFiles?: number, groupId?: string }
) => {
    return <MyImageHub readyImagesRef={readyImagesRef} maxFiles={maxFiles} groupId={groupId}  />;
});

ImageHub.displayName = 'ImageHub';

export default ImageHub;