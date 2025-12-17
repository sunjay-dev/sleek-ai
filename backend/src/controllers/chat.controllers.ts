import { type Context } from "hono";
import { askAI } from "../utils/model.utils.js";
import prisma from "../config/prisma.config.js";
import { InternalServerError } from "../utils/appError.utils.js";

export async function handleGetUserChats(c: Context) {
  const userId = c.get("user");

  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
      },
    });

    return c.json(chats);
  } catch {
    throw new InternalServerError("Error occured while fetching users chats");
  }
}

export async function handleCreateUserChat(c: Context) {
  const userId = c.get("user");
  const { query } = await c.req.json();

  try {
    const newChat = await prisma.chat.create({
      data: {
        userId: userId,
        title: query ? query.substring(0, 30) + "..." : "New Chat",
      },
      select: { id: true },
    });

    return c.json({ chatId: newChat.id }, 201);
  } catch {
    throw new InternalServerError("Error occured while creating new chat");
  }
}

export async function handleAIResponse(c: Context) {
  const chatId = c.req.param("chatId");
  const userId = c.get("user");
  const { query, model } = await c.req.json();

  try {
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId },
      select: { id: true },
    });

    if (!chat) {
      return c.json({ error: "Chat not found or unauthorized" }, 404);
    }

    const aiResponse = await askAI(query, userId, model);

    await prisma.message.createMany({
      data: [
        { chatId, text: query, role: "USER" },
        { chatId, text: aiResponse as string, role: "ASSISTANT" },
      ],
      skipDuplicates: true,
    });

    return c.json({ response: aiResponse, isAi: true });
  } catch {
    throw new InternalServerError("Error occured while handling AI response");
  }
}
