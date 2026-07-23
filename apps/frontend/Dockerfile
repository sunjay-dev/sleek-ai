ARG NODE_VERSION=22-alpine
ARG PNPM_VERSION=10.32.1
# ---------------------- build ----------------------
FROM node:${NODE_VERSION} AS build

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY packages/typescript-config ./packages/typescript-config
COPY apps/frontend ./apps/frontend


RUN pnpm install --filter "@app/frontend..." --frozen-lockfile --ignore-scripts


WORKDIR /app/apps/frontend

RUN pnpm run build

# ---------------------- deploy ----------------------

FROM nginx:1.27-alpine AS deploy

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
