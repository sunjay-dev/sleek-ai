import { Queue } from "bullmq";

export const fileIngestQueue = new Queue("file-ingest", {
  connection: {
    url: process.env.REDIS_URL as string,
  },
  defaultJobOptions: {
    attempts: 2,
  },
});
