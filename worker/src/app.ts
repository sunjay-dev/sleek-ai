import { Worker, type Job } from "bullmq";
import { parseFileWithLangChain } from "./utils/parseFile.js";
import { chunkFile } from "./utils/chunkFile.js";
import { embedChunksAndStoreVectors } from "./utils/embedChunksAndStoreVectors.js";
import logger from "./utils/logger.utils.js";

type Data = {
  fileUrl: string;
  userId: string;
  chatId: string;
  fileId: string;
};

export async function handler(job: Job<Data>) {
  const { fileUrl, userId, chatId, fileId } = job.data;

  try {
    const docs = await parseFileWithLangChain(fileUrl);

    const chunks = await chunkFile(docs, 1000, 200);

    await embedChunksAndStoreVectors(chunks, { userId, chatId, fileId });

    logger.info({ message: "File processed successfully", fileId });
    return { success: true };
  } catch (error) {
    logger.error({ message: "Error processing", fileId, error });
    throw error;
  }
}

const worker = new Worker("file-ingest", handler, {
  connection: {
    url: process.env.REDIS_URL!,
  },
  limiter: { max: 5, duration: 1000 },
});

worker.on("ready", () => logger.info({ message: "Worker is ready to process jobs." }));

worker.on("completed", (job) => logger.info({ message: "Job ${job.id} completed successfully", job: job.id }));

worker.on("failed", (job, error) => console.error({ message: "Job failed", job: job?.id, error }));
