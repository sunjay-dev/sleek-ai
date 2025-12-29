import { type Context } from "hono";
import { getAIResponse } from "../utils/model.utils.js";
import prisma from "../config/prisma.config.js";
import { InternalServerError } from "../utils/appError.utils.js";

export async function handleUserMessageResponse(c: Context) {
  const { chatId } = c.get("param");
  const userId = c.get("user");
  const { query, model } = c.get("body");

  try {
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId },
      select: { id: true },
    });

    if (!chat) {
      return c.json({ error: "Chat not found or unauthorized" }, 404);
    }

    const threadId = `${userId}:${chatId}`;

    const response = await getAIResponse(query, threadId, model);

    if (!response) {
      throw new Error("Empty AI response");
    }

    await prisma.$transaction([
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
    ]);

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
