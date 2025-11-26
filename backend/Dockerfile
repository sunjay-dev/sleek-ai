# syntax=docker/dockerfile:1

ARG PNPM_VERSION=10.17.1
ARG BUN_VERSION=1.3.2-alpine

# ──────────────────────────────────────────────
# Base stage — Bun runtime + pnpm
# ──────────────────────────────────────────────
FROM oven/bun:${BUN_VERSION} AS base

WORKDIR /usr/src/app

# Install pnpm globally and required libs for Prisma
RUN apk add --no-cache openssl bash curl build-base && \
    bun install -g pnpm@${PNPM_VERSION}

# ──────────────────────────────────────────────
# Dependencies stage
# ──────────────────────────────────────────────
FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

# ──────────────────────────────────────────────
# Build stage
# ──────────────────────────────────────────────
FROM deps AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

RUN pnpx prisma generate

# ──────────────────────────────────────────────
# Final runtime stage
# ──────────────────────────────────────────────
FROM oven/bun:${BUN_VERSION} AS final

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Run as non-root user for safety
USER bun

COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/src ./src


EXPOSE 3000

# ──────────────────────────────────────────────
# Start app with Bun runtime
# ──────────────────────────────────────────────
CMD ["bun", "run", "start"]
