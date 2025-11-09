import * as z from "zod";

const subcategoryFormSchema = z.object({
    category: z
        .string()
        .min(1, "Please select a category.")
    ,
    name: z
        .string()
        .min(1, "Bug title must be at least 1 characters.")
        .max(32, "Bug title must be at most 32 characters."),
    description: z
        .string()
        .max(100, "Description must be at most 100 characters."),
})

export default subcategoryFormSchema;