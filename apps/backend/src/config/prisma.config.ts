import prisma from "@app/db";
import logger from "../utils/logger.utils.js";

async function initPrisma() {
  await prisma.$connect();
  logger.info({ service: "db", status: "connected" }, "Database ready");
}

initPrisma().catch((e) => {
  logger.error("Failed to connect Database:", e);
});

const gracefulShutdown = async () => {
  console.log("Shutting down gracefully.");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default prisma;
