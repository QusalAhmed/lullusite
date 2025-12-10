import { ImageResponse } from 'next/og'

// Actions
import getProduct from '@/actions/store/get-product'

// Image metadata
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
    console.log(params)
    const productId = '36e07843-7bba-4d3c-8c5b-a4fc01267b7a';
    const product = await getProduct(productId)


    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 128,
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {product?.name}
            </div>
        )
    )
}