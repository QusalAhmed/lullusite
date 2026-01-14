import React from 'react';
import { notFound } from 'next/navigation'

// Actions
import getPage from '@/actions/store/get-page';

// Local
import Products from './products';
import FeaturesSection from "./features";
import VideoPlayer from "./video-player";
import Floating from './floating';
import IncompleteOrder from './incomplete-order';
import Contact from './contact';

const Theme = async ({storeSlug}: {storeSlug: string}) => {
    const page = await getPage(storeSlug)

    if (!page) {
        return notFound();
    }

    return (
        <div>
            <Floating />
            <VideoPlayer />
            <FeaturesSection />
            <IncompleteOrder />
            <Contact />
            <Products />
        </div>
    );
};

export default Theme;