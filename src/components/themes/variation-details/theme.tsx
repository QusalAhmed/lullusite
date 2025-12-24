import React from 'react';

// Actions
import getPage from '@/actions/store/get-page';

// Local
import Products from './products';
import FeaturesSection from "./features";
import VideoPlayer from "./video-player";
import Floating from './floating';
import IncompleteOrder from './incomplete-order';

const Theme = async ({storeSlug}: {storeSlug: string}) => {
    const page = await getPage(storeSlug)

    return (
        <div>
            <div>{page?.title} | আমার সোনার বাংলা আমি তোমায় ভালোবাসি</div>
            <Floating />
            <VideoPlayer />
            <FeaturesSection />
            <IncompleteOrder />
            <Products />
        </div>
    );
};

export default Theme;