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
import { inArray } from 'drizzle-orm'

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
        sellerSKU
    } = validatedData

    // Check if seller SKU is unique
    if (sellerSKU) {
        // Generate all potential SKUs that will be created
        const potentialSKUs = variations.map(variation =>
            `${sellerSKU}-${variation.name}`
        )

        // Check if any of these SKUs already exist in the database
        const existingSKUs = await db
            .select({ sku: productVariationTable.sku })
            .from(productVariationTable)
            .where(inArray(productVariationTable.sku, potentialSKUs))

        if (existingSKUs.length > 0) {
            console.log('Duplicate sku')
            return {
                success: false,
                message: `SKU already exists: ${existingSKUs.map(s => s.sku).join(', ')}. Please use a different seller SKU.`
            }
        }
    }

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
            sellerSku: sellerSKU,
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
                sku: `${sellerSKU || nanoid()}-${variation.name}`,
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

