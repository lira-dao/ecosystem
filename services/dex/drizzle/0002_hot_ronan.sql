CREATE TABLE IF NOT EXISTS "staking_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"staker_address" varchar NOT NULL,
	"referrer_address" varchar,
	"staked_amount" numeric NOT NULL,
	"reward_amount" numeric NOT NULL,
	"staking_tx_id" varchar NOT NULL,
	"reward_tx_id" varchar,
	"created_at" timestamp DEFAULT now()
);
