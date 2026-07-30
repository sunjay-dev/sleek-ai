import { z } from "zod";

const dbEnvSchema = z.object({
  DATABASE_URL: z.url("DATABASE_URL must be a valid connection string"),
  DATABASE_CONNECTION_MIN: z.coerce.number().int().min(1).default(2),
  DATABASE_CONNECTION_MAX: z.coerce.number().int().min(1).default(10),
});

const parsed = dbEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid database environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const dbEnv = parsed.data;
