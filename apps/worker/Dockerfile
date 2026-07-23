ARG NODE_VERSION=24.11.0-alpine
ARG PNPM_VERSION=10.32.31

# ---------------------- base stage ----------------------
FROM node:${NODE_VERSION} AS base

RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/typescript-config ./packages/typescript-config
COPY apps/worker ./apps/worker

RUN pnpm install --filter "@app/worker..." --prod --frozen-lockfile --ignore-scripts

# ---------------------- build stage ----------------------
FROM base AS build

ENV CI=true
RUN pnpm install --filter "@app/worker..." --frozen-lockfile

WORKDIR /usr/src/app/apps/worker
RUN pnpm run build

# ---------------------- final stage ----------------------
FROM node:${NODE_VERSION} AS final


WORKDIR /usr/src/app/apps/worker

COPY --from=build /usr/src/app/apps/worker .

ENV NODE_ENV=production

CMD ["node", "./dist/server.js"]
