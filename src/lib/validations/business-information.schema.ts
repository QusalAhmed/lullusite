import z from "zod"

const businessInformationSchema = z.object({
    businessName: z
        .string()
        .min(1, "Business name is required")
        .max(255, "Business name must be at most 255 characters."),
    address: z
        .string()
        .max(512, "Address must be at most 512 characters.")
        .optional(),
    email: z
        .string()
        .email("Invalid email address")
        .max(255, "Email must be at most 255 characters.")
        .optional()
        .or(z.literal("")),
    phone: z
        .string()
        .max(50, "Phone must be at most 50 characters.")
        .optional(),
    description: z
        .string()
        .max(1024, "Description must be at most 1024 characters.")
        .optional(),
    logoImageId: z
        .string()
        .uuid()
        .optional()
        .or(z.literal("")),
})

export default businessInformationSchema;

