import z from "zod"

const productFormSchema = z
    .object({
        name: z
            .string()
            .min(5, "Product name must be at least 5 characters.")
            .max(255, "Product name must be at most 255 characters."),
        name_local: z
            .union([
                z.string()
                    .min(5, "Product name in local language must be at least 5 characters.")
                    .max(255, "Product name in local language must be at most 255 characters."),
                z.literal("")
            ]),
        images: z
            .array(
                z.string()
            )
            .min(1, "At least one product image is required.")
            .max(8, "At most 8 product images are allowed."),
        youtubeVideoLink: z
            .url({hostname: /^youtube\.com$/})
            .normalize()
            .or(z.string().min(0).max(0)),
        description: z.string().min(20, "Description must be at least 20 characters."),
        category: z.string().optional(),
        subcategory: z.string().optional(),
        tags: z.array(
            z.object({
                tag: z.string().min(1, "Add tag. Don't keep it black or remove this")
            })
        ),
        seoDescription: z.string(),
        sellerSKU: z
            .string()
            .max(100, "Seller SKU must be at most 100 characters.")
            .optional(),
        variations: z.array(
            z.object({
                name: z
                    .string()
                    .min(1, "Variation name must be at least 1 characters. Remove empty variation")
                    .max(100, "Variation name must be at most 100 characters."),
                price: z
                    .number('Price must be a number.')
                    .min(0, "Price must be at least 0."),
                stock: z
                    .number('Stock must be a number.'),
                weight: z
                    .number('Weight must be a number.')
                    .min(0, "Weight must be at least 0."),
                image: z.array(
                    z.string()
                ).min(1, "At least one image is required for each variation."),
                isActive: z
                    .boolean()
                    .optional(),
            })
        ).min(1, "At least one variation is required."),
    })
    // Must choose at least a category or a subcategory
    .refine(
        (data) => {
            const hasCategory = !!data.category && data.category.trim().length > 0
            const hasSubcategory = !!data.subcategory && data.subcategory.trim().length > 0
            return hasCategory || hasSubcategory
        },
        {
            message: "Please select a subcategory or a category.",
            path: ["subcategory"],
        }
    )

export default productFormSchema