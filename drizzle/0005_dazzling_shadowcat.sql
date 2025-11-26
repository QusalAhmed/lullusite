ALTER TABLE "product" ALTER COLUMN "seller_sku" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_seller_sku_unique" UNIQUE("seller_sku");