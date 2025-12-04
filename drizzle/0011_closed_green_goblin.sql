CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."incomplete_order_status" AS ENUM('active', 'converted', 'expired');--> statement-breakpoint
CREATE TABLE "order_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"product_variation_id" uuid NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"product_name_local" varchar(255),
	"sku" varchar(100) NOT NULL,
	"variation_name" varchar(100),
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"line_subtotal" numeric(10, 2) DEFAULT 0 NOT NULL,
	"line_discount_amount" numeric(10, 2) DEFAULT 0 NOT NULL,
	"line_total" numeric(10, 2) DEFAULT 0 NOT NULL,
	"weight" numeric(10, 2),
	"item_metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255),
	"merchant_id" varchar(255) NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"payment_status" varchar(50) DEFAULT 'unpaid' NOT NULL,
	"fulfillment_status" varchar(50) DEFAULT 'unfulfilled' NOT NULL,
	"currency" varchar(3) DEFAULT 'BDT' NOT NULL,
	"subtotal_amount" numeric(10, 2) DEFAULT 0 NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT 0 NOT NULL,
	"shipping_amount" numeric(10, 2) DEFAULT 0 NOT NULL,
	"total_amount" numeric(10, 2) DEFAULT 0 NOT NULL,
	"customer_email" varchar(255),
	"customer_phone" varchar(50) NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"shipping_full_name" varchar(255) NOT NULL,
	"shipping_phone" varchar(50),
	"shipping_address_line1" varchar(255) NOT NULL,
	"shipping_address_line2" varchar(255),
	"shipping_city" varchar(100) NOT NULL,
	"shipping_state" varchar(100),
	"shipping_postal_code" varchar(20),
	"shipping_country" varchar(100) DEFAULT 'Bangladesh' NOT NULL,
	"shipping_notes" varchar(500),
	"payment_method" varchar(50),
	"payment_provider" varchar(50),
	"payment_reference" varchar(255),
	"external_order_id" varchar(255),
	"notes" varchar(1000),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "incomplete_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incomplete_order_id" uuid NOT NULL,
	"product_variation_id" uuid NOT NULL,
	"variation_name" varchar(100),
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incomplete_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" varchar(50) NOT NULL,
	"merchant_id" varchar(255) NOT NULL,
	"status" "incomplete_order_status" DEFAULT 'active' NOT NULL,
	"converted_to_order_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_variation_id_product_variation_id_fk" FOREIGN KEY ("product_variation_id") REFERENCES "public"."product_variation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_merchant_id_user_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incomplete_order_items" ADD CONSTRAINT "incomplete_order_items_incomplete_order_id_incomplete_orders_id_fk" FOREIGN KEY ("incomplete_order_id") REFERENCES "public"."incomplete_orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "incomplete_order_items" ADD CONSTRAINT "incomplete_order_items_product_variation_id_product_variation_id_fk" FOREIGN KEY ("product_variation_id") REFERENCES "public"."product_variation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incomplete_orders" ADD CONSTRAINT "incomplete_orders_merchant_id_user_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;