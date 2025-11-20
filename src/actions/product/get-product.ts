'use server'

import db from '@/lib/drizzle-agent'
import { productTable, productImageTable, productVariationTable, productVariationImageTable } from '@/db/product.schema'
import { imageTable } from '@/db/image.schema'
import { eq } from 'drizzle-orm'

export type GetProductResult = {
  product: {
    id: string
    name: string
    name_local: string
    description: string
    youtubeVideoLink: string | null
    seoDescription: string
    tags: string[]
    category: string | null
    subcategory: string | null
    isActive: boolean
    isSuspended: boolean
    createdAt: Date | null
  } | null
  images: { id: string; url: string | null }[]
  variations: {
    id: string
    name: string
    sku: string | null
    price: number
    stock: number
    weight: number
    images: { id: string; url: string | null }[]
  }[]
}

export default async function getProduct(productId: string): Promise<GetProductResult> {
  if (!productId) return { product: null, images: [], variations: [] }

  const [product] = await db.select({
    id: productTable.id,
    name: productTable.name,
    name_local: productTable.name_local,
    description: productTable.description,
    youtubeVideoLink: productTable.youtubeVideoLink,
    seoDescription: productTable.seoDescription,
    tags: productTable.tags,
    category: productTable.category,
    subcategory: productTable.subcategory,
    isActive: productTable.isActive,
    isSuspended: productTable.isSuspended,
  }).from(productTable).where(eq(productTable.id, productId))
  if (!product) return { product: null, images: [], variations: [] }

  const productImagesRaw = await db
    .select({ id: productImageTable.id, image: productImageTable.image, url: imageTable.url })
    .from(productImageTable)
    .leftJoin(imageTable, eq(productImageTable.image, imageTable.id))
    .where(eq(productImageTable.productId, productId))

  const productVariationRaw = await db
    .select()
    .from(productVariationTable)
    .where(eq(productVariationTable.productId, productId))

  const variationImagesRaw = await db
    .select({ id: productVariationImageTable.id, productVariationId: productVariationImageTable.productVariationId, image: productVariationImageTable.image, url: imageTable.url })
    .from(productVariationImageTable)
    .leftJoin(imageTable, eq(productVariationImageTable.image, imageTable.id))
    .leftJoin(productVariationTable, eq(productVariationImageTable.productVariationId, productVariationTable.id))
    .where(eq(productVariationTable.productId, productId))

  const images = productImagesRaw.map(pi => ({ id: pi.id, url: pi.url }))

  const variations = productVariationRaw.map(variation => {
    const vImages = variationImagesRaw.filter(vImg => vImg.productVariationId === variation.id).map(vImg => ({ id: vImg.id, url: vImg.url }))
    return {
      id: variation.id,
      name: variation.name,
      sku: variation.sku,
      price: Number(variation.price),
      stock: variation.stock,
      weight: Number(variation.weight),
      images: vImages,
    }
  })

  return {
    product: {
      id: product.id,
      name: product.name,
      name_local: product.name_local,
      description: product.description,
      youtubeVideoLink: product.youtubeVideoLink ?? null,
      seoDescription: product.seoDescription,
      tags: product.tags ?? [],
      category: product.category ?? null,
      subcategory: product.subcategory ?? null,
      isActive: product.isActive,
      isSuspended: product.isSuspended,
      createdAt: null,
    },
    images,
    variations,
  }
}
