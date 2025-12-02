import z from 'zod'

export const checkoutFormSchema = z.object({
    name: z
        .string()
        .min(2, 'Full name must be at least 2 characters long')
        .or(z.string()),
    address: z
        .string()
        .min(5, 'Address must be at least 5 characters long')
        .or(z.string()),
    division: z
        .string(),
    phoneNumber: z
        .string()
        .min(10, 'Phone number must be at least 10 characters long'),
    remarks: z
        .string()
        .max(500, 'Remarks cannot exceed 500 characters')
        .or(z.string()),
})

// export type CheckoutFormType = z.infer<typeof checkoutFormSchema>