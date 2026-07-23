import { defineConfig, env } from "prisma/config";
import "dotenv/config";
import { resolve } from "path";

export default defineConfig({
  schema: resolve(import.meta.dirname, "../../packages/db/prisma/schema.prisma"),
  migrations: {
    path: resolve(import.meta.dirname, "../../packages/db/prisma/migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
