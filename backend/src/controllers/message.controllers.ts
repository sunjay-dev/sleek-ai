import { type Context } from "hono";
import { scheduleMemoryExtraction, generateAIResponse, extractImageData } from "../utils/model.utils.js";
import prisma from "../config/prisma.config.js";
import { NotFoundError } from "../utils/appError.utils.js";
import { streamText } from "hono/streaming";
import logger from "../utils/logger.utils.js";

export async function handleUserMessageResponse(c: Context) {
  const requestStartTime = new Date();
  const { chatId } = c.get("param");
  const userId = c.get("user");
  const { query, model, messageFiles } = c.get("body");
  const timezone = c.req.header("x-client-timezone") || "UTC";

  let finalQuery = `User message:\n${query}`;

  try {
    if (messageFiles && Array.isArray(messageFiles) && messageFiles.length > 0) {
      const extractionPromises = messageFiles.map((file: any) => {
        if (file.fileUrl) {
          return extractImageData(file.fileUrl);
        }
        return Promise.resolve(null);
      });

      const extractionResults = await Promise.allSettled(extractionPromises);

      const successfulData = extractionResults
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result: any) => result.value as string);

      if (successfulData.length > 0) {
        finalQuery += `\n\nExtracted information from attached images:\n${successfulData.join("\n---\n")}\n\nUse this information if relevant when answering.`;
      }
    }
  } catch (error) {
    logger.error({ message: "Failed to process attached images", error });
  }

  return streamText(c, async (stream) => {
    let fullResponse = "";

    try {
      const [chat, preferences, memories] = await Promise.all([
        prisma.chat.findUnique({ where: { id: chatId, userId }, select: { id: true } }),
        prisma.userPreference.upsert({ where: { userId }, create: { userId }, update: {} }),
        prisma.userMemory.findMany({ where: { userId }, select: { content: true } }),
      ]);

      if (!chat) {
        await stream.write("\n\n[Error: Chat not found or unauthorized]");
        return;
      }

      const aiStream = generateAIResponse({
        query: finalQuery,
        threadId: chatId,
        modelName: model,
        preferences,
        memories,
        timezone,
      });

      for await (const chunk of aiStream) {
        fullResponse += chunk;
        await stream.write(chunk);
      }

      const filesToCreate = messageFiles?.length ? messageFiles : undefined;

      await prisma.chat.update({
        where: { id: chatId },
        data: {
          updatedAt: requestStartTime,
          messages: {
            create: [
              {
                text: finalQuery,
                role: "USER",
                createdAt: requestStartTime,
                messageFiles: filesToCreate ? { create: filesToCreate } : undefined,
              },
              { text: fullResponse, role: "ASSISTANT" },
            ],
          },
        },
      });

      scheduleMemoryExtraction(userId, query, memories);
    } catch (error: any) {
      logger.error({
        message: "Streaming error",
        chatId,
        error: error.message,
      });
      await stream.write("\n\n[Error: Response generation interrupted]");
    }
  });
}

export async function handleGetAllChatMessages(c: Context) {
  const userId = c.get("user");
  const { chatId } = c.get("param");

  const chat = await prisma.chat.findFirst({
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
          messageFiles: {
            select: {
              fileName: true,
              fileType: true,
              fileUrl: true,
            },
          },
        },
      },
    },
  });

  if (!chat) {
    throw new NotFoundError("Chat not found or unauthorized");
  }

  return c.json(chat, 200);
}
