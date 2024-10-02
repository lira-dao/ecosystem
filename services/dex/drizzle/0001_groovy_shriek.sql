CREATE TABLE IF NOT EXISTS "price" (
	"chain_id" integer,
	"token0" varchar,
	"token1" varchar,
	"price" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"chain_id" integer,
	"address" varchar,
	"symbol" varchar,
	"name" varchar,
	"decimals" varchar
);
--> statement-breakpoint
ALTER TABLE "referral" ALTER COLUMN "referrer" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "referral" ALTER COLUMN "referral" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "referral" ADD CONSTRAINT "referral_referrer_referral_unique" UNIQUE("referrer","referral");