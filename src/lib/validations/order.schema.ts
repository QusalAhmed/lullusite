import {validatePhoneNumber} from "@/lib/phone-number"
// Zod
import { z } from 'zod'
import { createSelectSchema, createUpdateSchema } from 'drizzle-zod'

// db
import { orderTable } from '@/db/index.schema'


// Select Schema
const orderSelectSchema = createSelectSchema(orderTable, {
    merchantId: z.undefined(),
    customerId: z.undefined(),
    orderNumber: z.undefined(),
    amountPaid: z.undefined(),
    amountDue: z.undefined(),
    createdAt: z.undefined(),
    updatedAt: z.undefined(),
}).extend({
    items: z.array(z.object({
        variationId: z.string(),
        variationName: z.string().nullable(),
        quantity: z.coerce.number<number>().min(1, "Quantity must be at least 1"),
        unitPrice: z.coerce.number<number>().gte(0, "Unit price must be greater than 0"),
        discountPrice: z.coerce.number<number>().gte(0, "Discount price must be greater than 0"),
        totalPrice: z.number(),
        thumbnailUrl: z.url(),
    })).min(1, "Order must have at least one item"),
}).superRefine((values, ctx) => {
    if (values.paymentStatus === 'partially_paid' && (!values.partialAmount || values.partialAmount <= 0)) {
        ctx.addIssue({
            code: 'custom',
            message: 'Partial amount must be greater than 0 for partially paid orders',
            path: ['partialAmount'],
            input: values.partialAmount,
        });
    }

    if (values.shippingDivision === 'auto') {
        ctx.addIssue({
            code: 'custom',
            message: 'Auto detection of shipping division is not supported yet. Please select a specific division.',
            path: ['shippingDivision'],
        })
    }

    const phoneValidation = validatePhoneNumber(values.shippingPhone);
    if (!phoneValidation.isValid) {
        ctx.addIssue({
            code: 'custom',
            message: phoneValidation.error || 'Invalid phone number',
            path: ['shippingPhone'],
        });
    }
});

export { orderSelectSchema }

export type OrderSelectSchemaType = z.infer<typeof orderSelectSchema>


// Update Schema
const orderUpdateSchema = createUpdateSchema(orderTable, {
    id: z.uuid(),
})

export { orderUpdateSchema }

export type OrderUpdateSchemaType = z.infer<typeof orderUpdateSchema>