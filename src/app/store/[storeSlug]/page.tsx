import React from 'react'

// Theme
import Theme from '@/components/themes/variation-details/theme'

export default async function StorePage(
    {params}: { params: Promise<{ storeSlug: string }> }
) {
    const {storeSlug} = await params

    return (
        <div>
            <Theme storeSlug={storeSlug}/>
        </div>
    )
}