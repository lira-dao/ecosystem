import { sql } from 'drizzle-orm';
import {
  integer,
  numeric,
  pgTable,
  serial,
  unique,
  varchar,
  timestamp,
  pgEnum,
  text,
} from 'drizzle-orm/pg-core';

export const referral = pgTable(
  'referral',
  {
    referrer: varchar('referrer').notNull(),
    referral: varchar('referral').notNull(),
  },
  (t) => ({
    un_referrer_referral: unique().on(t.referrer, t.referral),
  }),
);

export const tokens = pgTable('tokens', {
  chainId: integer('chain_id'),
  address: varchar('address'),
  symbol: varchar('symbol'),
  name: varchar('name'),
  decimals: varchar('decimals'),
});

export const prices = pgTable('prices', {
  symbol: varchar('symbol').primaryKey().notNull(),
  price: numeric('price').notNull(),
  volume: numeric('volume').notNull(),
  marketCap: numeric('marketCap').notNull(),
});

export const lpPrices = pgTable(
  'lp_prices',
  {
    id: serial('id').primaryKey(),
    pairAddress: varchar('pair_address').notNull(),
    symbol: varchar('symbol').notNull(),
    price: numeric('price').notNull(),
    supply: varchar('supply'),
    updatedAt: timestamp('updated_at').default(sql`now()`),
  },
  (table) => ({
    unique_pair_address: unique().on(table.pairAddress, table.symbol),
  }),
);

export const price = pgTable('price', {
  chainId: integer('chain_id'),
  token0: varchar('token0'),
  token1: varchar('token1'),
  price: numeric('price').notNull(),
});

export const stakingRewards = pgTable('staking_rewards', {
  id: serial('id').primaryKey(),
  stakerAddress: varchar('staker_address').notNull(),
  referrerAddress: varchar('referrer_address'),
  tokenAddress: varchar('staked_token_address').notNull(),
  stakedAmount: numeric('staked_amount').notNull(),
  rewardAmount: numeric('reward_amount').notNull(),
  stakingTxId: varchar('staking_tx_id').notNull(),
  rewardTxId: varchar('reward_tx_id'),
  createdAt: timestamp('created_at').default(sql`now()`),
});

export const rewardStatusEnum = pgEnum('reward_status', [
  'pending',
  'distributed',
]);

export const referralRewards = pgTable('referral_rewards', {
  id: serial('id').primaryKey(),
  referrerAddress: varchar('referrer_address').notNull(),
  tokenAddresses: varchar('token_addresses').array().notNull(),
  amounts: numeric('amounts').array().notNull(),
  harvestTxId: varchar('harvest_tx_id'),
  distributionTxId: varchar('distribution_tx_id'),
  status: rewardStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`),
  distributedAt: timestamp('distributed_at'),
});

export const shortLinks = pgTable('short_links', {
  id: serial('id').primaryKey(),
  code: text('code').unique(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
