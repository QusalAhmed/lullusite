import React from 'react';

// Actions
import getPage from '@/actions/store/get-page';

// Local
import Products from './products';
import FeaturesSection from "./features";
// import VideoPlayer from "./video-player";

const Theme = async ({storeSlug}: {storeSlug: string}) => {
    const page = await getPage(storeSlug)

    return (
        <div>
            <div>{page?.title} | আমার সোনার বাংলা আমি তোমায় ভালোবাসি</div>
            {/*<VideoPlayer />*/}
            <FeaturesSection />
            <Products />
        </div>
    );
};

export default Theme;