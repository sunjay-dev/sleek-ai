# syntax=docker/dockerfile:1
ARG BUN_VERSION=1.3.3-alpine

# -------------------------------------------------
# base stage – install production dependencies only
# -------------------------------------------------
FROM oven/bun:${BUN_VERSION} AS base

WORKDIR /usr/src/app

# minimal system libs
RUN apk add --no-cache openssl

# copy manifests (pnpm-lock.yaml is still honoured)
COPY package.json pnpm-lock.yaml ./
RUN bun install --production

# -------------------------------------------------
# build stage – dev-deps + generate Prisma client
# -------------------------------------------------
FROM base AS build

# install *all* deps (including dev)
COPY package.json pnpm-lock.yaml ./
RUN bun install

# copy source and build artefacts
COPY . .

ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL
RUN bunx prisma generate

# -------------------------------------------------
# final stage – runtime
# -------------------------------------------------
FROM oven/bun:${BUN_VERSION} AS final

WORKDIR /usr/src/app
ENV NODE_ENV=production

# security – run as non-root
USER bun

# copy only runtime necessities
COPY package.json pnpm-lock.yaml ./
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/src ./src

EXPOSE 3000
CMD ["bun", "run", "start"]
