ARG NODE_VERSION=24.11.0-alpine
ARG PNPM_VERSION=10.32.1

# ---------------------- install deps + build ----------------------
FROM node:${NODE_VERSION} AS build
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile --ignore-scripts

ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

RUN pnpm turbo run build

# ---------------------- production deps ----------------------
FROM node:${NODE_VERSION} AS prod-deps
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/db/package.json ./packages/db/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# ---------------------- final runtime ----------------------
FROM node:${NODE_VERSION} AS final
WORKDIR /usr/src/app

COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=prod-deps /usr/src/app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=prod-deps /usr/src/app/packages/db/node_modules ./packages/db/node_modules

COPY --from=build /usr/src/app/packages/shared/dist ./packages/shared/dist
COPY --from=build /usr/src/app/packages/shared/package.json ./packages/shared/

COPY --from=build /usr/src/app/packages/db/dist ./packages/db/dist
COPY --from=build /usr/src/app/packages/db/prisma ./packages/db/prisma
COPY --from=build /usr/src/app/packages/db/package.json ./packages/db/

COPY --from=build /usr/src/app/apps/backend/dist ./apps/backend/dist
COPY --from=build /usr/src/app/apps/backend/package.json ./apps/backend/

COPY --from=build /usr/src/app/apps/frontend/dist ./apps/frontend/dist

WORKDIR /usr/src/app/apps/backend

EXPOSE 3000

CMD ["node", "dist/app.js"]
