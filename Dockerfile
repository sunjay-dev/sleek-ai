ARG NODE_VERSION=24.11.0-alpine
ARG PNPM_VERSION=10.32.1

# ===================== build =====================
FROM node:${NODE_VERSION} AS build
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile --ignore-scripts

ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN pnpm turbo run build --filter=@app/shared --filter=@app/db --filter=@app/backend --filter=@app/frontend

RUN pnpm deploy --filter @app/backend --prod --legacy /deploy

# ===================== runtime =====================
FROM node:${NODE_VERSION} AS final
WORKDIR /usr/src/app

COPY --from=build /deploy /usr/src/app

COPY --from=build /usr/src/app/apps/frontend/dist /usr/src/frontend/dist

# Remove files not needed at runtime
RUN rm -rf src .turbo prisma.config.ts tsconfig.json

EXPOSE 3000

CMD ["node", "dist/app.js"]
