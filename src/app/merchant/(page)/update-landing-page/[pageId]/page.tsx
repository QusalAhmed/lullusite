import React from 'react';

// Actions
import getPage from '@/actions/page/get-page';

// Local
import PageForm from '@/components/page/page-form';

const UpdatePage = async ({params}: {params: Promise<{pageId: string}>}) => {
    const {pageId} = await params;
    const page = await getPage(pageId);

    return (
        <div>
            <PageForm formData={{
                id: page.id,
                title: page.title,
                slug: page.slug,
            }} />
        </div>
    );
};

export default UpdatePage;