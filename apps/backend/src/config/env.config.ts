import { z } from "zod";

const backendEnvSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.string().url(),

  GROQ_API_KEY: z.string().min(1),
  TAVILY_API_KEY: z.string().min(1),
  LANGCHAIN_TRACING_V2: z.string().optional(),
  LANGCHAIN_API_KEY: z.string().optional(),

  MEMORY_MODEL: z.string().default("groq/compound-mini"),
  TITLE_MODEL: z.string().default("groq/compound-mini"),
  SUMMARIZER_MODEL: z.string().default("groq/compound-mini"),
  VISION_MODEL: z.string().default("meta-llama/llama-4-scout-17b-16e-instruct"),

  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  PROMETHEUS_SECRET: z.string().min(1),

  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),

  GOOGLE_EMBEDDINGS_MODEL: z.string().min(1),
  GOOGLE_API_KEY: z.string().min(1),
  PINECONE_API_KEY: z.string().min(1),
  PINECONE_INDEX_NAME: z.string().min(1),

  WEATHER_API_KEY: z.string().min(1),

  APP_JOB_NAME: z.string().default("chatty-ai-backend"),
});

const parsed = backendEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid backend environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const backendEnv = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === "production",
  isDevelopment: parsed.data.NODE_ENV === "development",
};
