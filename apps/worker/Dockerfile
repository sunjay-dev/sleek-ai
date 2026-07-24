ARG NODE_VERSION=24.11.0-alpine
ARG PNPM_VERSION=10.32.1

# ---------------------- install deps + build ----------------------
FROM node:${NODE_VERSION} AS build
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/shared ./packages/shared
COPY packages/typescript-config ./packages/typescript-config
COPY apps/worker ./apps/worker

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm turbo run build --filter=@app/shared --filter=@app/worker

# ---------------------- production deps ----------------------
FROM node:${NODE_VERSION} AS prod-deps
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/worker/package.json ./apps/worker/

RUN pnpm install --filter "@app/worker..." --prod --frozen-lockfile --ignore-scripts

# ---------------------- final runtime ----------------------
FROM node:${NODE_VERSION} AS final
WORKDIR /usr/src/app

COPY --from=prod-deps /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/packages/shared/dist ./packages/shared/dist
COPY --from=build /usr/src/app/packages/shared/package.json ./packages/shared/

COPY --from=build /usr/src/app/apps/worker/dist ./apps/worker/dist
COPY --from=build /usr/src/app/apps/worker/package.json ./apps/worker/

RUN mkdir -p node_modules/@app/shared
COPY --from=build /usr/src/app/packages/shared/dist ./node_modules/@app/shared/dist
COPY --from=build /usr/src/app/packages/shared/package.json ./node_modules/@app/shared/

WORKDIR /usr/src/app/apps/worker

ENV NODE_ENV=production

CMD ["node", "dist/app.js"]
