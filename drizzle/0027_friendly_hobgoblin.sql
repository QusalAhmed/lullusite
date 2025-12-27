ALTER TABLE "orders" ALTER COLUMN "shipping_country" SET DEFAULT 'BD';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "ip_address" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "ip_address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "user_agent" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "action_source" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "event_source_url" varchar(1000) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "metadata";