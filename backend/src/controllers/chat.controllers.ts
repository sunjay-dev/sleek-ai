import { type Context } from "hono";
import { generateTitle } from "../utils/model.utils.js";
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

export async function handleRenameUserChat(c: Context) {
  const { chatId } = c.get("param");
  const { title } = c.get("body");
  const userId = c.get("user");

  try {
    const chat = await prisma.chat.updateMany({
      where: { id: chatId, userId },
      data: { title },
    });

    if (chat.count === 0) {
      return c.json({ error: "Chat not found or unauthorized" }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    throw new InternalServerError("Something went wrong, please try again later.", { error });
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

export async function handleDeleteAllUserChat(c: Context) {
  const userId = c.get("user");

  try {
    const count = await prisma.chat.deleteMany({
      where: { userId },
    });

    return c.json({ success: true, deleted: count });
  } catch (error) {
    throw new InternalServerError("Failed to delete chats", { error });
  }
}
