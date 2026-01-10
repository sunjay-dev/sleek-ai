import { Context } from "hono";
import prisma from "../config/prisma.config.js";
import { NotFoundError } from "../utils/appError.utils.js";

export async function handleGetUserPreferences(c: Context) {
  const userId = c.get("user");

  const preferences = await prisma.userPreference.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  return c.json(preferences, 200);
}

export async function handleUpdateUserPreferences(c: Context) {
  const userId = c.get("user");
  const { nickname, occupation, about, customInstructions } = c.get("body");

  const preferences = await prisma.userPreference.upsert({
    where: { userId },
    update: { nickname, occupation, about, customInstructions },
    create: { userId, nickname, occupation, about, customInstructions },
  });

  return c.json(preferences, 200);
}

export async function handleGetUserMemories(c: Context) {
  const userId = c.get("user");

  const memories = await prisma.userMemory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
    },
  });

  return c.json(memories, 200);
}

export async function handleDeleteUserMemory(c: Context) {
  const userId = c.get("user");
  const { memoryId } = c.get("param");

  const result = await prisma.userMemory.deleteMany({
    where: {
      id: memoryId,
      userId: userId,
    },
  });

  if (result.count === 0) {
    throw new NotFoundError("Memory not found or you do not have permission to delete it.");
  }

  return c.json({ success: true, message: "Memory deleted" }, 200);
}

export async function handleDeleteAllMemories(c: Context) {
  const userId = c.get("user");
  const result = await prisma.userMemory.deleteMany({
    where: { userId },
  });

  return c.json({ message: "Deleted all memories", count: result.count }, 200);
}
