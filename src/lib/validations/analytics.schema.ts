import z from "zod"

const analyticsSchema = z.object({
    facebookPixelId: z
        .string()
        .max(255, "Facebook Pixel ID must be at most 255 characters.")
        .optional()
        .or(z.literal("")),

    facebookConversionApiKey: z
        .string()
        .max(512, "Facebook Conversion API Key must be at most 512 characters.")
        .optional()
        .or(z.literal("")),

    facebookConversionApiVersion: z
        .string()
        .max(50, "Facebook Conversion API Version must be at most 50 characters.")
        .optional()
        .or(z.literal("")),

    googleAnalyticsKey: z
        .string()
        .max(255, "Google Analytics Key must be at most 255 characters.")
        .optional()
        .or(z.literal("")),

    googleAnalyticsMeasurementId: z
        .string()
        .max(255, "Google Analytics Measurement ID must be at most 255 characters.")
        .optional()
        .or(z.literal("")),

    googleAdsConversionId: z
        .string()
        .max(255, "Google Ads Conversion ID must be at most 255 characters.")
        .optional()
        .or(z.literal("")),

    googleAdsConversionLabel: z
        .string()
        .max(255, "Google Ads Conversion Label must be at most 255 characters.")
        .optional()
        .or(z.literal("")),

    tiktokPixelId: z
        .string()
        .max(255, "TikTok Pixel ID must be at most 255 characters.")
        .optional()
        .or(z.literal("")),

    tiktokAccessToken: z
        .string()
        .max(512, "TikTok Access Token must be at most 512 characters.")
        .optional()
        .or(z.literal("")),

    snapchatPixelId: z
        .string()
        .max(255, "Snapchat Pixel ID must be at most 255 characters.")
        .optional()
        .or(z.literal("")),

    linkedinPartnerId: z
        .string()
        .max(255, "LinkedIn Partner ID must be at most 255 characters.")
        .optional()
        .or(z.literal("")),

    pinterestPixelId: z
        .string()
        .max(255, "Pinterest Pixel ID must be at most 255 characters.")
        .optional()
        .or(z.literal("")),

    customTrackingCode: z
        .string()
        .optional()
        .or(z.literal("")),

    isEnabled: z
        .boolean()
        .optional(),
});

export default analyticsSchema;

