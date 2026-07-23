import { type Context } from "hono";
import cloudinary from "../config/cloudinary.config.js";
import prisma from "../config/prisma.config.js";
import { fileIngestQueue } from "../config/queue.config.js";

export async function handleFileSignature(c: Context) {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "chatty-ai";
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET as string);

  return c.json(
    {
      signature,
      folder,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    },
    200,
  );
}

export async function handleStartRag(c: Context) {
  const userId = c.get("user");
  const body = await c.req.json();
  const { fileUrl, fileName, fileType, chatId } = body;

  if (!fileUrl) {
    return c.json({ error: "Missing fileUrl" }, 400);
  }

  if (fileType && fileType.includes("image")) {
    return c.json({ error: "Image files are not supported for RAG parsing" }, 400);
  }

  let targetChatId = chatId;

  if (!targetChatId) {
    let title = "Document Chat";
    if (fileName) {
      const lastDot = fileName.lastIndexOf(".");
      title = lastDot !== -1 ? fileName.substring(0, lastDot) : fileName;
    }

    const newChat = await prisma.chat.create({
      data: {
        userId,
        title,
        ragStatus: "PROCESSING",
      },
    });
    targetChatId = newChat.id;
  } else {
    await prisma.chat.update({
      where: { id: targetChatId, userId },
      data: {
        ragStatus: "PROCESSING",
      },
    });
  }

  const tempFileId = crypto.randomUUID();

  await fileIngestQueue.add("ingest", {
    fileUrl,
    userId,
    chatId: targetChatId,
    fileId: tempFileId,
  });

  return c.json({ success: true, chatId: targetChatId }, 200);
}
