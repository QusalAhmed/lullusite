ALTER TABLE "steadfast_parcel" ALTER COLUMN "order_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "consignment_id" varchar(100);