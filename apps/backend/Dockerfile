ARG NODE_VERSION=22-alpine
ARG PNPM_VERSION=10.32.1
# ---------------------- base stage ----------------------
FROM node:${NODE_VERSION} AS base
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY packages/db ./packages/db
COPY packages/typescript-config ./packages/typescript-config
COPY apps/backend ./apps/backend

RUN pnpm install --filter "@app/backend..." --prod --frozen-lockfile --ignore-scripts

WORKDIR /usr/src/app/apps/backend
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate --schema=../../packages/db/prisma/schema.prisma


# ---------------------- final runtime stage ----------------------
FROM node:${NODE_VERSION} AS final
WORKDIR /usr/src/app

COPY --from=base /usr/src/app .

WORKDIR /usr/src/app/apps/backend

CMD ["node", "dist/app.js"]
