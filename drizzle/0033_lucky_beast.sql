ALTER TABLE "orders" ADD COLUMN "amount_paid" numeric(10, 2) DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "amount_due" numeric(10, 2) DEFAULT 0 NOT NULL;