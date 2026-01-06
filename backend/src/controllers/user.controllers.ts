import { Context } from "hono";
import prisma from "../config/prisma.config.js";
import logger from "../utils/logger.utils.js";

export async function handleGetUserPreferences(c: Context) {
  const userId = c.get("user");

  const prefs = await prisma.userPreference.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  return c.json(prefs, 200);
}

export async function handleUpdateUserPreferences(c: Context) {
  const userId = c.get("user");
  const { nickname, occupation, about, customInstructions } = c.get("body");

  const prefs = await prisma.userPreference.upsert({
    where: { userId },
    update: { nickname, occupation, about, customInstructions },
    create: { userId, nickname, occupation, about, customInstructions },
  });

  return c.json(prefs, 200);
}

export async function handleGetUserMemories(c: Context) {
  const userId = c.get("user");
  try {
    const memories = await prisma.userMemory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
      },
    });

    return c.json(memories, 200);
  } catch (error) {
    logger.error({ message: "Error fetching memories:", error });
    return c.json({ error: "Failed to fetch memories" }, 500);
  }
}

export async function handleDeleteUserMemory(c: Context) {
  const userId = c.get("user");
  const { memoryId } = c.get("param");

  try {
    const result = await prisma.userMemory.deleteMany({
      where: {
        id: memoryId,
        userId: userId,
      },
    });

    if (result.count === 0) {
      return c.json({ error: "Memory not found or unauthorized" }, 404);
    }

    return c.json({ success: true, message: "Memory deleted" }, 200);
  } catch (error) {
    logger.error({ message: "Error deleting memory:", error });
    return c.json({ error: "Failed to delete memory" }, 500);
  }
}

export async function handleDeleteAllMemories(c: Context) {
  const userId = c.get("user");
  try {
    const result = await prisma.userMemory.deleteMany({
      where: { userId },
    });

    return c.json(
      {
        message: `Deleted all memories`,
        count: result.count,
      },
      200,
    );
  } catch (error) {
    logger.error({ message: "Error deleting all user memories:", error });
    return c.json({ error: "Failed to clear memories" }, 500);
  }
}
