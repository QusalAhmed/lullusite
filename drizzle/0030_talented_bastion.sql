CREATE TYPE "public"."action_source_enum" AS ENUM('email', 'website', 'app', 'phone_call', 'chat', 'physical_store', 'system_generated', 'business_messaging', 'other');--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipping_phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipping_address" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipping_country" SET DEFAULT 'Bangladesh';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "action_source" SET DATA TYPE "public"."action_source_enum" USING "action_source"::"public"."action_source_enum";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "partial_amount" numeric(10, 2) DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tax_amount" numeric(10, 2) DEFAULT 0 NOT NULL;