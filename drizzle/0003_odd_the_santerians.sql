ALTER TABLE "categories" DROP CONSTRAINT "categories_image_id_image_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."image"("id") ON DELETE cascade ON UPDATE cascade;