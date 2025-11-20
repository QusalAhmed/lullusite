import z from "zod"

const userSchema = z.object({
    name: z
        .string()
        .max(32, "Bug title must be at most 32 characters."),
    address: z
        .string()
        .max(100, "Description must be at most 100 characters."),
    businessName: z
        .string()
        .max(100, "Business name must be at most 100 characters."),
    details: z
        .string()
        .max(100, "Details must be at most 100 characters."),
})

export default userSchema;