import { z } from "zod";

export const courierCodeEnum = z.enum([
    "steadfast",
    "redx",
    "pathao",
]);

// Single courier configuration
export const courierSchema = z.object({
    courierCode: courierCodeEnum,
    courierName: z.string().max(255).optional().or(z.literal("")),
    apiKey: z.string().max(512).optional().or(z.literal("")),
    username: z.string().max(255).optional().or(z.literal("")),
    apiSecret: z.string().max(512).optional().or(z.literal("")),
    accountId: z.string().max(255).optional().or(z.literal("")),
    // required boolean so RHF types line up
    isEnabled: z.boolean(),
}).superRefine((val, ctx) => {
    if (val.isEnabled) {
        // When enabled, require at least apiKey or username
        if (!val.apiKey && !val.username) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["apiKey"],
                message: "API key or username is required when courier is enabled",
            });
        }
    }
});

// Form schema for all supported couriers at once
const courierSettingsFormSchema = z.object({
    steadfast: courierSchema.safeExtend({ courierCode: z.literal("steadfast") }),
    redx: courierSchema.safeExtend({ courierCode: z.literal("redx") }),
    pathao: courierSchema.safeExtend({ courierCode: z.literal("pathao") }),
});

export type CourierSettingsFormValues = z.infer<typeof courierSettingsFormSchema>;

export default courierSettingsFormSchema;
