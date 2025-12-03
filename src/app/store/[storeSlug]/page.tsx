import React from 'react'

// Theme
import Theme from '@/components/themes/variation-details/theme'

// Local
import CheckoutPage from './checkout/page'

export default async function StorePage(
    {params}: { params: Promise<{ storeSlug: string }> }
) {
    const {storeSlug} = await params

    return (
        <>
            <Theme storeSlug={storeSlug}/>
            <CheckoutPage />
        </>
    )
}