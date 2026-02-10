CREATE INDEX "idx_shipping_phone" ON "orders" USING btree ("shipping_phone");--> statement-breakpoint
CREATE INDEX "idx_shipping_name" ON "orders" USING btree ("shipping_full_name");