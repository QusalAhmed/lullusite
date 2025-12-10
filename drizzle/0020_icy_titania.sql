ALTER TABLE "orders" RENAME COLUMN "shipping_address_line1" TO "shipping_address";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_additional_phone" varchar(50);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_division" varchar(50);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "ip_address" varchar(45);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "user_agent" varchar(1000);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_note" varchar(1000);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "merchant_note" varchar(1000);--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_address_line2";