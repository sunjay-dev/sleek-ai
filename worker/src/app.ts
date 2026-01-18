import { Worker, Job } from "bullmq";
import { parseFileWithLangChain } from "./utils/parseFile.js";
import { chunkFile } from "./utils/chunkFile.js";
import { embedChunksAndStoreVectors } from "./utils/embedChunksAndStoreVectors.js";

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

    console.log(`File processed successfully: fileId=${fileId}`);
    return { success: true };
  } catch (err) {
    console.error(`Error processing fileId=${fileId}:`, err);
    throw err;
  }
}

const worker = new Worker("file-ingest", handler, {
  connection: {
    url: process.env.REDIS_URL!,
  },
  limiter: { max: 5, duration: 1000 },
});

worker.on("ready", () => console.log("Worker is ready to process jobs."));

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed`, error);
});
