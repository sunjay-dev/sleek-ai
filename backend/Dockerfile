ARG BUN_VERSION=1.3.3-alpine
ARG PNPM_VERSION=10.17.1
# ---------------------- base stage ----------------------
FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /usr/src/app

RUN apk add --no-cache openssl \
    && bun install -g pnpm@${PNPM_VERSION}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared ./shared
COPY backend ./backend

RUN pnpm install --filter "@app/backend..." --prod --frozen-lockfile --ignore-scripts

WORKDIR /usr/src/app/backend
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL
RUN pnpx prisma generate


# ---------------------- final runtime stage ----------------------
FROM oven/bun:${BUN_VERSION} AS final
WORKDIR /usr/src/app

COPY --from=base /usr/src/app .

WORKDIR /usr/src/app/backend

CMD ["bun", "run", "start"]