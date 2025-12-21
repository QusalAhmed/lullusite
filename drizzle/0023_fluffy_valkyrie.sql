CREATE TABLE "courier" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"courier_code" varchar(50) NOT NULL,
	"courier_name" varchar(255),
	"api_key" varchar(512),
	"username" varchar(255),
	"api_secret" varchar(512),
	"account_id" varchar(255),
	"is_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "courier" ADD CONSTRAINT "courier_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "user_courier_unique" ON "courier" USING btree ("user_id","courier_code");