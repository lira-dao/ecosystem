#!/usr/bin/env bash

pnpm build

docker compose build --no-cache

RPC_URL=rpc-url \
WALLET_ADDRESS=wallet-address \
WALLET_PRIVATE_KEY=wallet-private-key \
docker compose up -d && docker compose logs -f
