import React from 'react';

// Actions
import getPageBySlug from '@/actions/page/get-page-by-slug'

// Local
import Products from './products';

const Theme = async ({storeSlug}: {storeSlug: string}) => {
    const page = await getPageBySlug(storeSlug)

    return (
        <div>
            <div>{page.title} | আমার সোনার বাংলা আমি তোমায় ভালোবাসি</div>
            <Products />
        </div>
    );
};

export default Theme;