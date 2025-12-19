# syntax=docker/dockerfile:1
ARG PNPM_VERSION=10.17.1
ARG BUN_VERSION=1.3.3-alpine

# syntax=docker/dockerfile:1
FROM oven/bun:${BUN_VERSION}

WORKDIR /usr/src/app

RUN apk add --no-cache bash curl openssl \
    && bun install -g pnpm@${PNPM_VERSION}

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL
RUN pnpx prisma generate

USER bun
EXPOSE 3000
CMD ["bun", "run", "start"]
