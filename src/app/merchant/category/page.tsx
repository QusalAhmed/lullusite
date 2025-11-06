import React from 'react';

// Local
import NewCategoryDialog from './new-category-dialog'

const CategoryPage = () => {
    return (
        <div className={'flex items-center justify-between p-1 md:p-3 flex-col md:flex-row gap-2'}>
            <h1 className={'text-blue-600 font-semibold text-2xl'}>Category</h1>
            <NewCategoryDialog/>
        </div>
    );
};

export default CategoryPage;