ARG BUN_VERSION=1.3.3-alpine

# ---------------------- base ----------------------

FROM oven/bun:${BUN_VERSION} AS base

WORKDIR /app

COPY package*.json bun.lock ./
RUN bun install

COPY . .

RUN bun run build

# ---------------------- deploy ----------------------

FROM nginx:1.27-alpine AS deploy

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]