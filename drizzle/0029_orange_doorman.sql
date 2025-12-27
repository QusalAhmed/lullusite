ALTER TABLE "orders" ALTER COLUMN "order_number" SET DEFAULT nextval
        ('order_number_seq');--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "fbc" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "fbp" text NOT NULL;