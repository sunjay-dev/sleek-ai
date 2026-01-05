import { type Context } from "hono";
import { extractFactualMemory, generateAIResponse } from "../utils/model.utils.js";
import prisma from "../config/prisma.config.js";
import { InternalServerError } from "../utils/appError.utils.js";

export async function handleUserMessageResponse(c: Context) {
  const { chatId } = c.get("param");
  const userId = c.get("user");
  const { query, model } = c.get("body");

  try {
    const [chat, preferences, memories] = await Promise.all([
      prisma.chat.findFirst({ where: { id: chatId, userId }, select: { id: true } }),
      prisma.userPreference.upsert({ where: { userId }, create: { userId }, update: {} }),
      prisma.userMemory.findMany({ where: { userId }, select: { content: true } }),
    ]);

    if (!chat) {
      return c.json({ error: "Chat not found or unauthorized" }, 404);
    }

    const [response, newMemories] = await Promise.all([
      generateAIResponse({
        query,
        threadId: chatId,
        modelName: model,
        preferences,
        memories,
      }),

      extractFactualMemory(query, memories),
    ]);

    if (!response) {
      throw new Error("Empty AI response");
    }

    const transactionOperations = [
      prisma.message.create({
        data: { chatId, text: query, role: "USER" },
      }),
      prisma.message.create({
        data: { chatId, text: response, role: "ASSISTANT" },
      }),
      prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      }),
    ];

    if (newMemories.length > 0) {
      transactionOperations.push(
        prisma.userMemory.createMany({
          data: newMemories.map((m) => ({ userId, content: m.content })),
        }) as any,
      );
    }

    await prisma.$transaction(transactionOperations);

    return c.json(response, 200);
  } catch (error) {
    throw new InternalServerError("Error occured while handling AI response", { error });
  }
}

export async function handleGetAllChatMessages(c: Context) {
  const userId = c.get("user");
  const { chatId } = c.get("param");

  try {
    const chatWithMessages = await prisma.chat.findFirst({
      where: { id: chatId, userId },
      select: {
        id: true,
        title: true,
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            text: true,
            role: true,
          },
        },
      },
    });

    if (!chatWithMessages) {
      return c.json({ message: "Chat not found or unauthorized" }, 400);
    }

    return c.json(chatWithMessages, 200);
  } catch (error) {
    throw new InternalServerError("Error fetching chat messages", { error });
  }
}
