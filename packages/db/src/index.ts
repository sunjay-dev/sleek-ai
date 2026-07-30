import { dbEnv } from "./config/env.config.js";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

export { PrismaClient } from "./generated/prisma/client.js";
export type { User, UserMemory, UserPreference, Chat, Message, MessageFile } from "./generated/prisma/client.js";
export { RagStatus, MessageRole } from "./generated/prisma/client.js";

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: dbEnv.DATABASE_URL,
    min: dbEnv.DATABASE_CONNECTION_MIN,
    max: dbEnv.DATABASE_CONNECTION_MAX,
  });

  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

prisma
  .$connect()
  .then(() => {
    console.warn("[db] Database connected");
  })
  .catch((e) => {
    console.error("[db] Failed to connect:", e);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
