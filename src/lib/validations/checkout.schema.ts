import z from 'zod'
import { validatePhoneNumber } from '@/lib/phone-number';

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
        .string(),
    remarks: z
        .string()
        .max(500, 'Remarks cannot exceed 500 characters')
        .or(z.string()),
}).refine((data) => {
    const phoneNumber = data.phoneNumber;
    return validatePhoneNumber(phoneNumber);
}, {
    message: 'Invalid phone number format',
    path: ['phoneNumber'],
})

// export type CheckoutFormType = z.infer<typeof checkoutFormSchema>