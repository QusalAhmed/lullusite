ALTER TABLE "image" ADD COLUMN "thumbnail_url" varchar(2048);--> statement-breakpoint
ALTER TABLE "image" ADD COLUMN "hash" text NOT NULL;