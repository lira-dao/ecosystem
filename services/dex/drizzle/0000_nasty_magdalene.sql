CREATE TABLE IF NOT EXISTS "prices" (
	"symbol" varchar PRIMARY KEY NOT NULL,
	"price" numeric NOT NULL,
	"volume" numeric NOT NULL,
	"marketCap" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral" (
	"referrer" varchar,
	"referral" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral_url" (
	"referrer" varchar PRIMARY KEY NOT NULL,
	"url" varchar
);
