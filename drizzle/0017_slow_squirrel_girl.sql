ALTER TABLE "orders" ALTER COLUMN "order_number" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_number" SET DEFAULT nextval('order_number_seq');