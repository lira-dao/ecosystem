DO $$ BEGIN
 CREATE TYPE "public"."reward_status" AS ENUM('pending', 'distributed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lp_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"pair_address" varchar NOT NULL,
	"symbol" varchar NOT NULL,
	"price" numeric NOT NULL,
	"supply" varchar,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "lp_prices_pair_address_symbol_unique" UNIQUE("pair_address","symbol")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "price" (
	"chain_id" integer,
	"token0" varchar,
	"token1" varchar,
	"price" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prices" (
	"symbol" varchar PRIMARY KEY NOT NULL,
	"price" numeric NOT NULL,
	"volume" numeric NOT NULL,
	"marketCap" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral" (
	"referrer" varchar NOT NULL,
	"referral" varchar NOT NULL,
	CONSTRAINT "referral_referrer_referral_unique" UNIQUE("referrer","referral")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"referrer_address" varchar NOT NULL,
	"token_addresses" varchar[] NOT NULL,
	"amounts" numeric[] NOT NULL,
	"harvest_tx_id" varchar,
	"distribution_tx_id" varchar,
	"status" "reward_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"distributed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "short_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "short_links_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staking_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"staker_address" varchar NOT NULL,
	"referrer_address" varchar,
	"staked_token_address" varchar NOT NULL,
	"staked_amount" numeric NOT NULL,
	"reward_amount" numeric NOT NULL,
	"staking_tx_id" varchar NOT NULL,
	"reward_tx_id" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"chain_id" integer,
	"address" varchar,
	"symbol" varchar,
	"name" varchar,
	"decimals" varchar
);
