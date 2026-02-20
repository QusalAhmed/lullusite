ALTER TYPE "public"."order_status" ADD VALUE 'hold' BEFORE 'confirmed';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "payment_method" SET DEFAULT 'COD';