import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
    // Fetch the total number of products and calculate the number of sitemaps needed
    return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props: {
    id: Promise<number>
}): Promise<MetadataRoute.Sitemap> {
    const id = await props.id
    console.log('Generating sitemap for id:', id)
    // Google's limit is 50,000 URLs per sitemap
    const products = [
        { id: '1', date: new Date().toISOString() },
        { id: '2', date: new Date().toISOString() },
    ]
    return products.map((product) => ({
        url: `.../product/${product.id}`,
        lastModified: product.date,
    }))
}