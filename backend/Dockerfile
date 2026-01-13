ARG BUN_VERSION=1.3.3-alpine
ARG PNPM_VERSION=10.17.1
# ---------------------- base stage ----------------------
FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /usr/src/app

RUN apk add --no-cache openssl \
    && bun install -g pnpm@${PNPM_VERSION}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared ./shared
COPY backend ./backend

RUN pnpm install --filter "@app/backend..." --prod --frozen-lockfile --ignore-scripts

WORKDIR /usr/src/app/backend
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL
RUN pnpx prisma generate


# ---------------------- final runtime stage ----------------------
FROM oven/bun:${BUN_VERSION} AS final
WORKDIR /usr/src/app

COPY --from=base /usr/src/app .

WORKDIR /usr/src/app/backend

CMD ["bun", "run", "start"]


# FROM oven/bun:${BUN_VERSION} AS build
# WORKDIR /usr/src/app

# RUN apk add --no-cache openssl && bun install -g pnpm@${PNPM_VERSION}

# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# COPY backend/package.json ./backend/package.json
# COPY shared/package.json ./shared/package.json

# RUN pnpm install --filter "@app/backend..." --prod --frozen-lockfile --ignore-scripts

# COPY backend ./backend
# COPY shared ./shared

# WORKDIR /usr/src/app/backend

# ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# ENV DATABASE_URL=$DATABASE_URL

# RUN pnpx prisma generate

# # ---------------------- final runtime stage ----------------------
# FROM oven/bun:${BUN_VERSION} AS final

# RUN bun install -g pnpm@${PNPM_VERSION}

# WORKDIR /usr/src/app

# COPY --from=build /usr/src/app/backend ./backend
# COPY --from=build /usr/src/app/shared ./shared
# COPY --from=build /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/pnpm-*.yaml ./
# COPY --from=build /usr/src/app/package.json ./

# ENV NODE_ENV=production
# USER bun
# EXPOSE 3000

# WORKDIR /usr/src/app/backend
# CMD ["bun", "run", "start"]

# ARG BUN_VERSION=1.3.3-alpine
# ARG PNPM_VERSION=10.17.1

# # ---------------------- base stage ----------------------
# FROM oven/bun:${BUN_VERSION}
# WORKDIR /usr/src/app

# RUN apk add --no-cache openssl \
#     && bun install -g pnpm@${PNPM_VERSION}

# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# COPY shared ./shared
# COPY backend ./backend

# RUN pnpm install --filter "@app/backend..." --prod --frozen-lockfile --ignore-scripts

# WORKDIR /usr/src/app/backend
# ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# ENV DATABASE_URL=$DATABASE_URL
# RUN pnpx prisma generate

# CMD ["bun", "run", "start"]

# # Copy only package.json and lockfiles first
# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# COPY shared/package.json ./shared/package.json
# COPY backend/package.json ./backend/package.json

# # Install only backend+shared dependencies in place
# RUN pnpm install --filter "@app/backend..." --prod --frozen-lockfile --ignore-scripts

# # ---------------------- build stage ----------------------
# FROM base AS build
# WORKDIR /usr/src/app/backend

# # Copy backend source code and shared folder
# COPY backend ./
# COPY ../shared ../shared

# ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# ENV DATABASE_URL=$DATABASE_URL

# # Generate Prisma client
# RUN pnpx prisma generate

# # ---------------------- final stage ----------------------
# FROM oven/bun:${BUN_VERSION} AS final
# WORKDIR /usr/src/app/backend

# # Copy backend code + generated prisma client
# COPY --from=build /usr/src/app/backend ./
# COPY --from=build /usr/src/app/shared ../shared

# # Copy backend-specific node_modules (not root)
# COPY --from=base /usr/src/app/backend/node_modules ./node_modules

# ENV NODE_ENV=production
# USER bun
# EXPOSE 3000

# CMD ["bun", "run", "start"]
