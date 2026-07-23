ARG BUN_VERSION=1.3.3-alpine
ARG PNPM_VERSION=10.32.1
# ---------------------- build ----------------------
FROM oven/bun:${BUN_VERSION} AS build

RUN bun install -g pnpm@${PNPM_VERSION}

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY packages/typescript-config ./packages/typescript-config
COPY apps/frontend ./apps/frontend


RUN pnpm install --filter "@app/frontend..." --frozen-lockfile --ignore-scripts


WORKDIR /app/apps/frontend

RUN bun run build

# ---------------------- deploy ----------------------

FROM nginx:1.27-alpine AS deploy

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
