import { pgTable, text, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Local
import { user } from "@/db/index.schema";

// Helper
import timestamps from "./columns.helpers";

export const analyticsTable = pgTable("analytics", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() =>
            user.id,
        {
            onDelete: "cascade",
            onUpdate: "cascade"
        }
    ).notNull().unique(),

    // Facebook
    facebookPixelId: varchar("facebook_pixel_id", { length: 255 }),
    facebookConversionApiKey: varchar("facebook_conversion_api_key", { length: 512 }),
    facebookConversionApiVersion: varchar("facebook_conversion_api_version", { length: 50 }),

    // Google Analytics
    googleAnalyticsKey: varchar("google_analytics_key", { length: 255 }),
    googleAnalyticsMeasurementId: varchar("google_analytics_measurement_id", { length: 255 }),

    // Google Ads
    googleAdsConversionId: varchar("google_ads_conversion_id", { length: 255 }),
    googleAdsConversionLabel: varchar("google_ads_conversion_label", { length: 255 }),

    // TikTok
    tiktokPixelId: varchar("tiktok_pixel_id", { length: 255 }),
    tiktokAccessToken: varchar("tiktok_access_token", { length: 512 }),

    // Snapchat
    snapchatPixelId: varchar("snapchat_pixel_id", { length: 255 }),

    // LinkedIn
    linkedinPartnerId: varchar("linkedin_partner_id", { length: 255 }),

    // Pinterest
    pinterestPixelId: varchar("pinterest_pixel_id", { length: 255 }),

    // Custom Events
    customTrackingCode: text("custom_tracking_code"),

    // Flags
    isEnabled: boolean("is_enabled").default(true),

    ...timestamps
});

export const analyticsRelations = relations(analyticsTable, ({ one }) => ({
    user: one(user, {
        fields: [analyticsTable.userId],
        references: [user.id]
    })
}));

