import React from 'react';

// Local
import Products from './products';
import FeaturesSection from "./features";
import VideoPlayer from "./video-player";
import Floating from './floating';
import IncompleteOrder from './incomplete-order';
import Contact from './contact';

const Theme = async () => {
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