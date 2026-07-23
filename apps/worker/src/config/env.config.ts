import { z } from "zod";

const workerEnvSchema = z.object({
  REDIS_URL: z.string().min(1),

  GOOGLE_EMBEDDINGS_MODEL: z.string().min(1),
  GOOGLE_API_KEY: z.string().min(1),
  PINECONE_API_KEY: z.string().min(1),
  PINECONE_INDEX_NAME: z.string().min(1),
});

const parsed = workerEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid worker environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const workerEnv = parsed.data;
