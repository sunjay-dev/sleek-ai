ARG BUN_VERSION=1.3.3-alpine
ARG PNPM_VERSION=10.32.1
# ---------------------- build ----------------------
FROM oven/bun:${BUN_VERSION} AS build

RUN bun install -g pnpm@${PNPM_VERSION}

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared ./shared
COPY frontend ./frontend


RUN pnpm install --filter "@app/frontend..." --frozen-lockfile --ignore-scripts


WORKDIR /app/frontend

RUN bun run build

# ---------------------- deploy ----------------------

FROM nginx:1.27-alpine AS deploy

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]