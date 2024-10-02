#!/usr/bin/env bash

PG_USER=postgres \
PG_PASSWORD=password \
PG_NAME=dex \
pnpm run drizzle:push
