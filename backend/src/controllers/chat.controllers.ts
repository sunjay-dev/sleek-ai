import { type Context } from "hono";
import { generateTitle } from "../utils/model.utils.js";
import prisma from "../config/prisma.config.js";
import { NotFoundError } from "../utils/appError.utils.js";

export async function handleGetUserChats(c: Context) {
  const userId = c.get("user");

  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
    },
  });

  return c.json(chats, 200);
}

export async function handleCreateUserChat(c: Context) {
  const userId = c.get("user");
  const { query } = c.get("body");

  const title = await generateTitle(query);
  const newChat = await prisma.chat.create({
    data: {
      userId,
      title,
    },
  });

  return c.json(newChat, 201);
}

export async function handleRenameUserChat(c: Context) {
  const { chatId } = c.get("param");
  const { title } = c.get("body");
  const userId = c.get("user");

  const chat = await prisma.chat.updateMany({
    where: { id: chatId, userId },
    data: { title },
  });

  if (chat.count === 0) throw new NotFoundError("Chat not found or unauthorized");

  return c.json({ success: true });
}

export async function handleDeleteUserChat(c: Context) {
  const { chatId } = c.get("param");
  const userId = c.get("user");

  const result = await prisma.chat.deleteMany({
    where: { id: chatId, userId },
  });

  if (result.count === 0) throw new NotFoundError("Chat not found or unauthorized");

  return c.json({ success: true });
}

export async function handleDeleteAllUserChat(c: Context) {
  const userId = c.get("user");

  const count = await prisma.chat.deleteMany({
    where: { userId },
  });

  return c.json({ success: true, deleted: count });
}
export async function handleChatStatus(c: Context) {
  const { chatId } = c.get("param");
  const userId = c.get("user");

  const chat = await prisma.chat.findUnique({
    where: { id: chatId, userId },
    select: {
      ragStatus: true,
    },
  });

  if (!chat) throw new NotFoundError("Chat not found or unauthorized");

  return c.json(chat, 200);
}
