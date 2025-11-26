import React, {Suspense} from 'react';

const EditProductLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </>
    );
};

export default EditProductLayout;