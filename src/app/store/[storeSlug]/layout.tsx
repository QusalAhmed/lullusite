import React, {ReactNode} from 'react';
import type { Metadata } from 'next'

// Local
import Navbar from '@/components/themes/navbar/navbar'

// Actions
import getProduct from '@/actions/store/get-product'
// import getUser from '@/actions/store/get-user'

export async function generateMetadata(
    { params }: { params: Promise<{ storeSlug: string }> }
): Promise<Metadata> {
    const storeSlug = (await params).storeSlug
    console.log(storeSlug)
    const productId = '36e07843-7bba-4d3c-8c5b-a4fc01267b7a';
    const product = await getProduct(productId)
    // const userDetails = await getUser(storeSlug)

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.',
        }
    }

    return {
        title: product.name,
        description: product.description,

        // Other
        generator: 'Next.js',
        applicationName: 'Next.js',
        referrer: 'origin-when-cross-origin',
        keywords: product.tags,
        authors: [{ name: 'Qusal Ahmed', url: '' }],
        creator: 'Qusal Ahmed',
        publisher: 'Lullu Site',
        metadataBase: new URL(storeSlug ? `https://lullusite.com/store/${storeSlug}` : 'https://lullusite.com'),

        // Open Graph
        openGraph: {
            title: product.name,
            description: product.description,
            url: '/',
            siteName: product.name,
            images: [
                {
                    url: product.images[0].image.url, // Must be an absolute URL
                    width: 800,
                    height: 600,
                },
                {
                    url: product.images[0].image.url, // Must be an absolute URL
                    width: 1800,
                    height: 1600,
                    alt: 'My custom alt',
                },
            ],
            videos: [
                {
                    url: product.images[0].image.url, // Must be an absolute URL
                    width: 800,
                    height: 600,
                },
            ],
            audio: [
                {
                    url: product.images[0].image.url, // Must be an absolute URL
                },
            ],
            locale: 'bn_BD',
            type: 'website',
        },

        // Robots
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

        // Icon
        icons: {
            icon: product.images[0].image.url,
            shortcut: product.images[0].image.url,
            apple: product.images[0].image.url,
            other: {
                rel: product.images[0].image.url,
                url: product.images[0].image.url,
            },
        },

        // manifest: 'https://nextjs.org/manifest.json',
    }
}


const PageLayout = async (
    {children, params}: {children: ReactNode, params: Promise<{ storeSlug: string }>}
) => {
    const {storeSlug} = await params

    return (
        <>
            {children}
            <div className='h-24'/>
            <Navbar storeSlug={storeSlug} />
        </>
    );
};

export default PageLayout;