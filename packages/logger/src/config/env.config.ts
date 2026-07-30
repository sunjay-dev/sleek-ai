import { z } from "zod";

const loggerEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

const parsed = loggerEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid logger environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const loggerEnv = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === "production",
};
