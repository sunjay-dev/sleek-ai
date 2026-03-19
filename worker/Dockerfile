ARG BUN_VERSION=1.3.11-alpine
ARG PNPM_VERSION=10.30.3

FROM oven/bun:${BUN_VERSION} AS base

RUN bun install -g pnpm@${PNPM_VERSION}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY worker ./worker

RUN pnpm install --filter "@app/worker..." --prod --frozen-lockfile --ignore-scripts

WORKDIR /usr/src/app/worker

CMD pnpm start