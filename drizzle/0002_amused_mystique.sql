CREATE TABLE "image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"url" varchar(2048) NOT NULL,
	"alt_text" varchar(512),
	"width" varchar(10),
	"height" varchar(10),
	"size" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "image_id" uuid;--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "image_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."image"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "image";