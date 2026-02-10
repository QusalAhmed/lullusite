ALTER TYPE "public"."order_status" ADD VALUE 'incomplete_order' BEFORE 'pending';--> statement-breakpoint
ALTER TABLE "order_item" ALTER COLUMN "quantity" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "order_item" ALTER COLUMN "quantity" DROP DEFAULT;