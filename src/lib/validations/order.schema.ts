import {validatePhoneNumber} from "@/lib/phone-number"
// Zod
import { z } from 'zod'
import { createSelectSchema, createUpdateSchema, createInsertSchema } from 'drizzle-zod'

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

    // Shipping details
    shippingFullName: (schema) => schema.min(1, "Shipping full name is required"),
    shippingAddress: (schema) => schema.min(1, "Shipping address is required"),
    shippingPhone: (schema) => schema.min(1, "Shipping phone is required"),
}).extend({
    items: z.array(z.object({
        variationId: z.string(),
        variationName: z.string().nullable(),
        quantity: z.coerce.number<number>().gte(0, "Quantity must be greater than 0"),
        unitPrice: z.coerce.number<number>().gte(0, "Unit price must be greater than 0"),
        discountPrice: z.coerce.number<number>().gte(0, "Discount price must be greater than 0"),
        totalPrice: z.number(),
        thumbnailUrl: z.url(),
    })).min(1, "Order must have at least one item"),
}).superRefine((values, ctx) => {
    console.log('Refining order select schema with values:', values);
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

// Insert Schema
const orderInsertSchema = createInsertSchema(orderTable, {
    merchantId: z.undefined(),
    customerId: z.undefined(),
})

export { orderInsertSchema }

export type OrderInsertSchemaType = z.infer<typeof orderInsertSchema>