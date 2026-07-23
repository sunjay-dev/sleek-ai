import { z } from "zod";

const dbEnvSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),
});

const parsed = dbEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid database environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const dbEnv = parsed.data;
