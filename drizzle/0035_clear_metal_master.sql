CREATE TYPE "public"."courier_code_enum" AS ENUM('steadfast', 'pathao', 'redx', 'paperfly', 'carryBee', 'eCourier', 'delivery-tiger', 'others');--> statement-breakpoint
CREATE TABLE "steadfast_parcel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"consignment_id" varchar(100) NOT NULL,
	"tracking_code" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "courier_code" "courier_code_enum";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "is_courier_booked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "steadfast_parcel" ADD CONSTRAINT "steadfast_parcel_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;