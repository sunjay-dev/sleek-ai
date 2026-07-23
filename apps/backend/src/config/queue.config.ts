import { Queue, QueueEvents } from "bullmq";
import prisma from "./prisma.config.js";
import { backendEnv } from "./env.config.js";

export const fileIngestQueue = new Queue("file-ingest", {
  connection: {
    url: backendEnv.REDIS_URL,
  },
  defaultJobOptions: {
    attempts: 2,
  },
});

const queueEvents = new QueueEvents("file-ingest", {
  connection: {
    url: backendEnv.REDIS_URL,
  },
});

queueEvents.on("completed", async ({ jobId }) => {
  const job = await fileIngestQueue.getJob(jobId);

  if (job) {
    const { chatId } = job.data;

    await prisma.chat.update({
      where: { id: chatId },
      data: { ragStatus: "COMPLETED", isRag: true },
    });
  }
});

queueEvents.on("failed", async ({ jobId }) => {
  const job = await fileIngestQueue.getJob(jobId);

  if (job) {
    const { chatId } = job.data;

    await prisma.chat.update({
      where: { id: chatId },
      data: { ragStatus: "FAILED" },
    });
  }
});
