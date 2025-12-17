# syntax=docker/dockerfile:1
ARG PNPM_VERSION=10.17.1
ARG BUN_VERSION=1.3.3-alpine

# ──────────────────────────────────────────────
# Base stage: Bun + pnpm + dependencies
# ──────────────────────────────────────────────
FROM oven/bun:${BUN_VERSION} AS base

WORKDIR /usr/src/app

# Install required system libs and pnpm
RUN apk add --no-cache bash curl build-base openssl \
    && bun install -g pnpm@${PNPM_VERSION}

# Copy lockfile and package.json first for caching
COPY package.json pnpm-lock.yaml ./

# Install prod dependencies only
RUN pnpm install --prod --frozen-lockfile

# ──────────────────────────────────────────────
# Build stage: install dev dependencies and generate Prisma client
# ──────────────────────────────────────────────
FROM base AS build

# Install dev dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Prisma generate (needs full dev dependencies)
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

RUN pnpx prisma generate

# ──────────────────────────────────────────────
# Final stage: runtime
# ──────────────────────────────────────────────
FROM oven/bun:${BUN_VERSION} AS final

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Non-root user
USER bun

# Copy only necessary files for runtime
COPY package.json pnpm-lock.yaml ./
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/src ./src

EXPOSE 3000

CMD ["bun", "run", "start"]
