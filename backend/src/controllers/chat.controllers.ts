import { type Context } from "hono";
import { generateTitle, getAIResponse } from "../utils/model.utils.js";
import prisma from "../config/prisma.config.js";
import { InternalServerError } from "../utils/appError.utils.js";

export async function handleGetUserChats(c: Context) {
  const userId = c.get("user");

  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
      },
    });

    return c.json(chats, 200);
  } catch (error) {
    throw new InternalServerError("Error occured while fetching users chats", { error });
  }
}

export async function handleCreateUserChat(c: Context) {
  const userId = c.get("user");
  const { query } = c.get("body");

  try {
    const title = await generateTitle(query);
    const newChat = await prisma.chat.create({
      data: {
        userId,
        title,
      },
    });

    return c.json(newChat, 201);
  } catch (error) {
    throw new InternalServerError("Error occured while creating new chat", { error });
  }
}

export async function handleChatResponse(c: Context) {
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

    await prisma.$transaction(async (transaction) => {
      await transaction.message.create({
        data: {
          chatId,
          text: query,
          role: "USER",
        },
      });

      await transaction.message.create({
        data: {
          chatId,
          text: response,
          role: "ASSISTANT",
        },
      });

      await transaction.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });
    });

    return c.json(response, 200);
  } catch (error) {
    throw new InternalServerError("Error occured while handling AI response", { error });
  }
}

export async function handleDeleteUserChat(c: Context) {
  const { chatId } = c.get("param");
  const userId = c.get("user");

  try {
    const result = await prisma.chat.deleteMany({
      where: { id: chatId, userId },
    });

    if (result.count === 0) {
      return c.json({ error: "Chat not found or unauthorized" }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    throw new InternalServerError("Failed to delete chat", { error });
  }
}

export async function handleGetChatMessages(c: Context) {
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
