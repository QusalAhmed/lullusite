CREATE TABLE "business_information" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"address" varchar(512),
	"email" varchar(255),
	"phone" varchar(50),
	"description" varchar(1024),
	"logo_image_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_information_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "business_information" ADD CONSTRAINT "business_information_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "business_information" ADD CONSTRAINT "business_information_logo_image_id_image_id_fk" FOREIGN KEY ("logo_image_id") REFERENCES "public"."image"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "additional_info";