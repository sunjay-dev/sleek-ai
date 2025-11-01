# syntax=docker/dockerfile:1

# ──────────────────────────────────────────────
# Build arguments
# ──────────────────────────────────────────────
ARG BUN_VERSION=1.3.0
ARG PNPM_VERSION=10.17.1

# ──────────────────────────────────────────────
# Base stage — Bun runtime + pnpm
# ──────────────────────────────────────────────
FROM oven/bun:${BUN_VERSION}-alpine AS base

WORKDIR /usr/src/app

# Install pnpm globally (still using npm inside Bun image)
RUN bun install -g pnpm@${PNPM_VERSION}

# ──────────────────────────────────────────────
# Dependencies stage
# ──────────────────────────────────────────────
FROM base AS deps

# Use cache mount for pnpm store
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
RUN pnpm run build

# ──────────────────────────────────────────────
# Final runtime stage
# ──────────────────────────────────────────────
FROM oven/bun:${BUN_VERSION}-alpine AS final

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Run as non-root user for safety
USER bun

COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

# ──────────────────────────────────────────────
# Start app with Bun runtime
# ──────────────────────────────────────────────
CMD ["bun", "run", "start"]
