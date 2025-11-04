FROM node:24-alpine AS build

WORKDIR /app

RUN npm i -g pnpm

COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .
RUN pnpm run build


FROM nginx:1.27-alpine AS deploy

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
