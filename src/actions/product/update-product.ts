'use server'

import { revalidatePath } from "next/cache";

// Auth
import getSession from "@/lib/get-session";

// db
import db from '@/lib/drizzle-agent'
import { productTable, productVariationTable, productImageTable, productVariationImageTable } from '@/db/product.schema'
import { and, eq, inArray } from 'drizzle-orm'

// Zod
import z from 'zod';

// Validations
import productFormSchema from "@/lib/validations/product.schema";

const updateProductSchema = productFormSchema.safeExtend({
    id: z.uuid(),
})

export default async function updateProduct(data: z.infer<typeof updateProductSchema>) {
    const session = await getSession()

    const validatedData = updateProductSchema.parse(data)

    const {
        id,
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
    } = validatedData

    return await db.transaction(async (tx) => {
        // Check if product exists and belongs to the merchant
        const existingProduct = await tx
            .query
            .productTable
            .findFirst({
                where: and(
                    eq(productTable.id, id),
                    eq(productTable.merchantId, session.user.id)
                ),
            })

        if (!existingProduct) {
            return {
                success: false,
                message: "Product not found or unauthorized."
            }
        }

        // Update product (excluding sellerSku for now; adjust if needed)
        const [product] = await tx
            .update(productTable)
            .set({
                name,
                name_local,
                description,
                youtubeVideoLink,
                tags: tags.map((tag) => tag.tag),
                seoDescription,
                category,
                subcategory: subcategory || null,
            })
            .where(
                and(
                    eq(productTable.id, id),
                    eq(productTable.merchantId, session.user.id)
                )
            ).returning()

        if (!product) {
            return {
                success: false,
                message: "Failed to update product"
            }
        }

        // --- Sync product images ---
        const existingProductImages = await tx
            .select({image: productImageTable.image})
            .from(productImageTable)
            .where(eq(productImageTable.productId, id))

        const existingProductImageIds = existingProductImages.map(i => i.image)
        const incomingProductImageIds = Array.from(new Set(images))

        const productImagesToRemove = existingProductImageIds.filter(i => !incomingProductImageIds.includes(i))
        const productImagesToAdd = incomingProductImageIds.filter(i => !existingProductImageIds.includes(i))

        if (productImagesToRemove.length) {
            await tx
                .delete(productImageTable)
                .where(and(
                    eq(productImageTable.productId, id),
                    inArray(productImageTable.image, productImagesToRemove)
                ))
        }

        if (productImagesToAdd.length) {
            console.log("Adding product images:", productImagesToAdd)
            await tx
                .insert(productImageTable)
                .values(productImagesToAdd.map(imageId => ({
                    productId: id,
                    image: imageId,
                })))
        }

        // --- Sync variations ---
        const existingVariations = await tx
            .select({id: productVariationTable.id})
            .from(productVariationTable)
            .where(eq(productVariationTable.productId, id))

        const existingVariationIds = existingVariations.map(v => v.id)
        const incomingVariationIds = variations.filter(v => !!v.id).map(v => v.id!)
        const variationIdsToDelete = existingVariationIds.filter(vId => !incomingVariationIds.includes(vId))

        if (variationIdsToDelete.length) {
            await tx
                .delete(productVariationTable)
                .where(and(
                    eq(productVariationTable.productId, id),
                    inArray(productVariationTable.id, variationIdsToDelete)
                ))
            // Cascade deletes variation images
        }

        for (const variation of variations) {
            const { id: variationId, name: variationName, price, stock, weight, image: variationImages, isActive } = variation
            if (variationId) {
                // Update existing variation
                const [updatedVariation] = await tx
                    .update(productVariationTable)
                    .set({
                        name: variationName,
                        price,
                        stock,
                        weight,
                        isActive,
                    })
                    .where(and(
                        eq(productVariationTable.id, variationId),
                        eq(productVariationTable.productId, id),
                    ))
                    .returning()

                if (updatedVariation) {
                    // Sync variation images
                    const existingVarImages = await tx
                        .select({image: productVariationImageTable.image})
                        .from(productVariationImageTable)
                        .where(eq(productVariationImageTable.productVariationId, variationId))

                    const existingVarImageIds = existingVarImages.map(i => i.image)
                    const incomingVarImageIds = Array.from(new Set(variationImages))

                    const varImagesToRemove = existingVarImageIds.filter(i => !incomingVarImageIds.includes(i))
                    const varImagesToAdd = incomingVarImageIds.filter(i => !existingVarImageIds.includes(i))

                    if (varImagesToRemove.length) {
                        await tx
                            .delete(productVariationImageTable)
                            .where(and(
                                eq(productVariationImageTable.productVariationId, variationId),
                                inArray(productVariationImageTable.image, varImagesToRemove)
                            ))
                    }

                    if (varImagesToAdd.length) {
                        await tx
                            .insert(productVariationImageTable)
                            .values(varImagesToAdd.map(imageId => ({
                                productVariationId: variationId,
                                image: imageId,
                            })))
                    }
                }
            } else {
                // Insert new variation
                const [newVariation] = await tx
                    .insert(productVariationTable)
                    .values({
                        productId: product.id,
                        name: variationName,
                        sku: `${product.sellerSku}-${variationName}`,
                        price,
                        stock,
                        weight,
                        isActive,
                    })
                    .returning()

                if (newVariation) {
                    const uniqueImages = Array.from(new Set(variationImages))
                    if (uniqueImages.length) {
                        await tx
                            .insert(productVariationImageTable)
                            .values(uniqueImages.map(imageId => ({
                                productVariationId: newVariation.id,
                                image: imageId,
                            })))
                    }
                }
            }
        }

        revalidatePath(`/merchant/products`)

        return {
            success: true,
            message: "Product updated successfully."
        }
    })
}