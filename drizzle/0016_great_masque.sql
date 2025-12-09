CREATE SEQUENCE "public"."order_number_seq" INCREMENT BY 2 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1000 CACHE 10;--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_order_number_unique";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_number" SET DATA TYPE integer USING "order_number"::integer;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_number" SET DEFAULT nextval('order_number_seq');