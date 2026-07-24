ARG NODE_VERSION=24.11.0-alpine
ARG PNPM_VERSION=10.32.1

# ===================== build =====================
FROM node:${NODE_VERSION} AS build
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/shared ./packages/shared
COPY packages/typescript-config ./packages/typescript-config
COPY apps/worker ./apps/worker

RUN pnpm install --frozen-lockfile --ignore-scripts

RUN pnpm turbo run build --filter=@app/shared --filter=@app/worker

RUN pnpm deploy --filter @app/worker --prod --legacy /deploy

# ===================== runtime =====================
FROM node:${NODE_VERSION} AS final
WORKDIR /usr/src/app

COPY --from=build /deploy /usr/src/app

RUN rm -rf src .turbo Dockerfile tsconfig.json

ENV NODE_ENV=production

EXPOSE 3100

CMD ["node", "dist/app.js"]
