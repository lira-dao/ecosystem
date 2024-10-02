CREATE TABLE IF NOT EXISTS "lp_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"pair_address" varchar NOT NULL,
	"symbol" varchar NOT NULL,
	"price" numeric NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "lp_prices_pair_address_symbol_unique" UNIQUE("pair_address","symbol")
);
