#!/usr/bin/env bash

pnpm build

docker compose -f docker-compose-prd.yml build --no-cache

RPC_URL=rpc-url \
WS_URL=ws-url \
CMC_API_KEY=cmc-api-key \
POSTGRES_URL=postgres-url \
VIRTUAL_HOST=virtual-host \
LETSENCRYPT_HOST=host \
LETSENCRYPT_EMAIL=email \
PG_USER=postgres \
PG_PASSWORD=password \
PG_DB=dex-testnet \
docker compose -f docker-compose-prd.yml up -d && docker compose -f docker-compose-prd.yml logs -f
