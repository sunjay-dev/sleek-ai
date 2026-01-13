ARG BUN_VERSION=1.3.3-alpine

# ---------------------- build ----------------------
FROM oven/bun:${BUN_VERSION} AS build

RUN bun i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json ./shared/package.json
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json

ENV HUSKY=0

RUN pnpm install

COPY shared ./shared
COPY frontend ./frontend

WORKDIR /app/frontend
RUN bun run build

# ---------------------- deploy ----------------------

FROM nginx:1.27-alpine AS deploy

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]