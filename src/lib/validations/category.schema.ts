import z from "zod"

const categoryFormSchema = z.object({
    name: z
        .string()
        .min(1, "Must be at least 1 character.")
        .max(128, "Must be at most 128 characters.")
        .nonempty("Name is required.")
        .transform((val) => (
            val.trim().replace(/\b\w/g, char => char.toUpperCase())
        )),
    description: z
        .string()
        .max(1024, "Description must be at most 100 characters.")
        .optional(),
    image: z
        .string()
})

export { categoryFormSchema };