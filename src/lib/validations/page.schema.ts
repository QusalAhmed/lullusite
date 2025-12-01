import { z } from "zod";

// Action
import isStoreSlugUnique from "@/actions/page/slug-uniqueness";

const updatePageFormSchema = z.object({
    id: z
        .string(),
    title: z
        .string()
        .min(2, "Page title must be at least 2 characters.")
        .max(255, "Page title must be at most 255 characters.")
        .transform(val => val.trim()),
    slug: z
        .string()
        .min(5, "Page slug must be at least 5 characters.")
        .max(255, "Page slug must be at most 255 characters.")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens.")
        .transform(val => val.trim()),
});

const pageFormSchema = updatePageFormSchema
    .refine(async (data) => {
        return await isStoreSlugUnique(data.slug);
    }, {
        message: "This slug is already in use. Please choose another one.",
        path: ["slug"],
        when(payload) {
            return pageFormSchema
                .pick({title: true, slug: true})
                .safeParse(payload.value).success;
        },
    });

export { pageFormSchema, updatePageFormSchema };