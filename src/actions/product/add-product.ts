'use server'

import { nanoid } from 'nanoid'

// validation
import productFormSchema from '@/lib/validations/product.schema'

// Zod
import z from 'zod';

// Auth
import getSession from "@/lib/get-session";

// db
import db from '@/lib/drizzle-agent'
import { productTable, productImageTable, productVariationTable, productVariationImageTable } from '@/db/product.schema'
import { and, eq } from 'drizzle-orm'

export default async function addProduct(data: z.infer<typeof productFormSchema>) {
    const session = await getSession()

    // Validate data using productFormSchema
    const validatedData = productFormSchema.parse(data)

    const {
        name,
        name_local,
        description,
        youtubeVideoLink,
        tags,
        seoDescription,
        category,
        subcategory,
        images,
        variations,
        sellerSKU: sellerSKU,
    } = validatedData

    // Check if seller SKU is unique
    if (sellerSKU) {
        const existingProduct = await db
            .query
            .productTable
            .findFirst({
                where: and(
                    eq(productTable.merchantId, session.user.id),
                    eq(productTable.sellerSku, sellerSKU)
                ),
            })

        if (existingProduct) {
            return {
                success: false,
                message: "Seller SKU must be unique. The provided SKU already exists."
            }
        }
    }

    // Generate base SKU
    const sku = sellerSKU || nanoid()

    // Insert product
    const [product] = await db
        .insert(productTable)
        .values({
            merchantId: session.user.id,
            name,
            name_local: name_local || name,
            description,
            youtubeVideoLink: youtubeVideoLink || undefined,
            seoDescription,
            category: category || undefined,
            subcategory: subcategory || undefined,
            tags: tags.map((tag) => tag.tag),
            sellerSku: sku,
        })
        .returning({ productId: productTable.id })

    if (!product) {
        return {
            success: false,
            message: "Failed to create product"
        }
    }

    const { productId } = product

    // Insert product images
    if (images.length > 0) {
        await db
            .insert(productImageTable)
            .values(
                images.map(imageId => ({
                    productId,
                    image: imageId
                }))
            )
    }

    // Insert product variations
    const savedVariations = await db
        .insert(productVariationTable)
        .values(
            variations.map(variation => ({
                productId,
                name: variation.name,
                sku: `${sku}-${variation.name}`,
                price: variation.price,
                stock: variation.stock,
                weight: variation.weight,
            }))
        )
        .returning({ variationId: productVariationTable.id })

    // Insert variation images - flatten the nested array structure
    const variationImageValues = savedVariations.flatMap((savedVariation, index) =>
        variations[index].image.map(imageId => ({
            productVariationId: savedVariation.variationId,
            image: imageId,
        }))
    )

    if (variationImageValues.length > 0) {
        await db
            .insert(productVariationImageTable)
            .values(variationImageValues)
    }

    return {
        success: true,
        productId
    }
}

