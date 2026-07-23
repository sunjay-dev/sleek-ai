import { dbEnv } from "./config/env.config.js";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

export { PrismaClient } from "./generated/prisma/client.js";
export type { User, UserMemory, UserPreference, Chat, Message, MessageFile } from "./generated/prisma/client.js";
export { RagStatus, MessageRole } from "./generated/prisma/client.js";

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: dbEnv.DATABASE_URL,
  });

  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

export default prisma;
