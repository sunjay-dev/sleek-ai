# syntax=docker/dockerfile:1
ARG BUN_VERSION=1.3.3-alpine

# ---------------------- base ----------------------
FROM oven/bun:${BUN_VERSION} AS base

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY package.json bun.lock ./
RUN bun install --production

# ---------------------- build ----------------------

FROM base AS build

COPY package.json bun.lock ./
RUN bun install

COPY . .

ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL
RUN bunx prisma generate

# ---------------------- final ----------------------

FROM base AS final

WORKDIR /usr/src/app
ENV NODE_ENV=production

USER bun

COPY --from=build /usr/src/app/src ./src

EXPOSE 3000
CMD ["bun", "run", "start"]