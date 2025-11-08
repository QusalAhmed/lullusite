import React, {Suspense} from 'react';

// Local
import NewCategoryDialog from './new-category-dialog'
import CategoryList from './category-list';

const CategoryPage = () => {
    return (
        <div>
            <div className={'flex items-center justify-between p-1 md:p-3 flex-col md:flex-row gap-2'}>
                <h1 className={'text-blue-600 font-semibold text-2xl'}>Category</h1>
                <NewCategoryDialog/>
            </div>
            <Suspense fallback={<div>Loading categories...</div>}>
                <CategoryList/>
            </Suspense>
        </div>
    );
};

export default CategoryPage;