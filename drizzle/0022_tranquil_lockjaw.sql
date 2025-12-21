CREATE TABLE "analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"facebook_pixel_id" varchar(255),
	"facebook_conversion_api_key" varchar(512),
	"facebook_conversion_api_version" varchar(50),
	"google_analytics_key" varchar(255),
	"google_analytics_measurement_id" varchar(255),
	"google_ads_conversion_id" varchar(255),
	"google_ads_conversion_label" varchar(255),
	"tiktok_pixel_id" varchar(255),
	"tiktok_access_token" varchar(512),
	"snapchat_pixel_id" varchar(255),
	"linkedin_partner_id" varchar(255),
	"pinterest_pixel_id" varchar(255),
	"custom_tracking_code" text,
	"is_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "analytics_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;