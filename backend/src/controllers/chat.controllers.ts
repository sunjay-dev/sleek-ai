import { type Context } from "hono";
import { getAIResponse } from "../utils/model.utils.js";
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
    const title = query?.trim() ? query.trim().slice(0, 30) + "..." : "New Chat";

    const newChat = await prisma.chat.create({
      data: {
        userId,
        title,
      },
    });

    return c.json(newChat, 201);
  } catch {
    throw new InternalServerError("Error occured while creating new chat");
  }
}

export async function handleChatResponse(c: Context) {
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

    const threadId = `${userId}:${chatId}`;

    const aiResponse = await getAIResponse(query, threadId, model);

    await prisma.message.createMany({
      data: [
        { chatId, text: query, role: "USER" },
        { chatId, text: aiResponse as string, role: "ASSISTANT" },
      ],
      skipDuplicates: true,
    });

    return c.json({ response: aiResponse, isAi: true });
  } catch (error) {
    throw new InternalServerError("Error occured while handling AI response", { error });
  }
}

export async function handleDeleteUserChat(c: Context) {
  const userId = c.get("user");
  const chatId = c.req.param("chatId");

  if (!chatId) return c.json({ error: "Missing chat ID" }, 400);

  try {
    const result = await prisma.chat.deleteMany({
      where: { id: chatId, userId },
    });

    if (result.count === 0) {
      return c.json({ error: "Chat not found or unauthorized" }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete chat error:", error);
    throw new InternalServerError("Failed to delete chat", { error });
  }
}
