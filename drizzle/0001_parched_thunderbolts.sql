CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1024),
	"image_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sub_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1024),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"url" varchar(2048) NOT NULL,
	"thumbnail_url" varchar(2048),
	"alt_text" varchar(512),
	"width" integer,
	"height" integer,
	"size" integer,
	"hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "image_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE "product_image" (
	"product_id" uuid NOT NULL,
	"image" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_image_product_id_image_pk" PRIMARY KEY("product_id","image")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_local" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"youtube_video_link" varchar(255),
	"slug" varchar(255),
	"category" uuid,
	"subcategory" uuid,
	"tags" text[] DEFAULT '{}',
	"seo_description" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_suspended" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_variation_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_variation_id" uuid NOT NULL,
	"image" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"sku" varchar(100),
	"price" numeric(10, 2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"weight" numeric(10, 2) DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_variation_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."image"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "image_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_image_image_id_fk" FOREIGN KEY ("image") REFERENCES "public"."image"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_merchant_id_user_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_subcategory_sub_categories_id_fk" FOREIGN KEY ("subcategory") REFERENCES "public"."sub_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variation_image" ADD CONSTRAINT "product_variation_image_product_variation_id_product_variation_id_fk" FOREIGN KEY ("product_variation_id") REFERENCES "public"."product_variation"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_variation_image" ADD CONSTRAINT "product_variation_image_image_image_id_fk" FOREIGN KEY ("image") REFERENCES "public"."image"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "product_variation" ADD CONSTRAINT "product_variation_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;