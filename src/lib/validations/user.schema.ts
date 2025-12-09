import z from "zod"

const userSchema = z.object({
    name: z
        .string()
        .max(32, "Name must be at most 32 characters."),
})

export default userSchema;