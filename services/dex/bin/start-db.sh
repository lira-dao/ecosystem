#!/usr/bin/env bash

PG_USER=postgres \
PG_PASSWORD=password \
PG_NAME=dex-testnet \
docker compose -f docker-compose.yml up -d postgres && docker compose logs -f
