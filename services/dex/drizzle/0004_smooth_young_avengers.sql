DO $$ BEGIN
 CREATE TYPE "public"."reward_status" AS ENUM('pending', 'distributed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"referrer_address" varchar NOT NULL,
	"token_addresses" varchar[] NOT NULL,
	"amounts" numeric[] NOT NULL,
	"harvest_tx_id" varchar,
	"status" "reward_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"distributed_at" timestamp
);
