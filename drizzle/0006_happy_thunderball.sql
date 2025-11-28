ALTER TABLE "image" DROP CONSTRAINT "image_hash_unique";--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "thumbnail_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "alt_text" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "width" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "height" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "image" ALTER COLUMN "size" SET NOT NULL;