import z from "zod"

const categoryFormSchema = z.object({
    name: z
        .string()
        .min(1, "Bug title must be at least 1 character.")
        .max(128, "Bug title must be at most 128 characters."),
    description: z
        .string()
        .max(1024, "Description must be at most 100 characters.")
        .optional(),
    image: z
        .string()
})

export { categoryFormSchema };