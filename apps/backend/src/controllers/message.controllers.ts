import { type Context } from "hono";
import { streamSSE, type SSEStreamingApi } from "hono/streaming";
import { scheduleMemoryExtraction, generateAIResponse, extractImageData } from "../utils/model.utils.js";
import prisma from "../config/prisma.config.js";
import { NotFoundError } from "../utils/appError.utils.js";
import logger from "../utils/logger.utils.js";
import { streamLoading, streamText, streamError } from "../utils/stream.utils.js";
import { type UploadedFile } from "@app/shared/src/schemas/message.schema.js";

export async function handleUserMessageResponse(c: Context) {
  const requestStartTime = new Date();
  const { chatId } = c.req.param();
  const userId = c.get("user");
  const { query, model, messageFiles } = c.get("body");
  const timezone = c.req.header("x-client-timezone") || "UTC";

  return streamSSE(c, async (stream: SSEStreamingApi) => {
    let fullResponse = "";
    let finalQuery = query;

    finalQuery += await handleImageExtraction(messageFiles, stream);

    if (!finalQuery.trim()) {
      finalQuery = "Please summarize or describe the uploaded document.";
    }

    try {
      const [chat, preferences, memories] = await Promise.all([
        prisma.chat.findUnique({ where: { id: chatId, userId }, select: { id: true, isRag: true } }),
        prisma.userPreference.upsert({ where: { userId }, create: { userId }, update: {} }),
        prisma.userMemory.findMany({ where: { userId }, select: { content: true } }),
      ]);

      if (!chat) {
        await streamError(stream, "Chat not found or unauthorized");
        return;
      }

      const aiStream = generateAIResponse({
        query: finalQuery,
        threadId: chatId,
        modelName: model,
        preferences,
        memories,
        timezone,
        isRag: chat.isRag,
      });

      let isFirstChunk = true;
      for await (const chunk of aiStream) {
        if (isFirstChunk) {
          await streamLoading(stream, null);
          isFirstChunk = false;
        }
        fullResponse += chunk;
        await streamText(stream, chunk);
      }

      if (isFirstChunk) await streamLoading(stream, null);

      await prisma.chat.update({
        where: { id: chatId },
        data: {
          updatedAt: new Date(),
          messages: {
            create: [
              {
                text: query,
                role: "USER",
                createdAt: requestStartTime,
                messageFiles: messageFiles?.length ? { create: messageFiles } : undefined,
              },
              { text: fullResponse, role: "ASSISTANT", createdAt: new Date() },
            ],
          },
        },
      });

      if (query.trim()) scheduleMemoryExtraction(userId, query, memories);
    } catch (error: unknown) {
      const isError = error instanceof Error;
      const errorMessage = isError ? error.message : "Unknown streaming error";
      const originalCause = isError && error.cause ? error.cause : "No underlying cause";

      logger.error({
        message: "Streaming error",
        chatId,
        error: errorMessage,
        cause: originalCause,
      });
      await streamError(stream, "Response generation interrupted");
    }
  });
}

/**
 * Handle image context extraction with proper SSE types
 */
async function handleImageExtraction(messageFiles: UploadedFile[] | undefined, stream: SSEStreamingApi): Promise<string> {
  if (!messageFiles?.length) return "";

  const imageFiles = messageFiles.filter((file) => file.fileType?.includes("image") && file.fileUrl);
  if (imageFiles.length === 0) return "";

  try {
    await streamLoading(stream, "Analyzing image...");

    const extractionPromises = imageFiles.map((file) => extractImageData(file.fileUrl));
    const extractionResults = await Promise.allSettled(extractionPromises);

    const successfulData = extractionResults
      .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled" && typeof result.value === "string")
      .map((result) => result.value);

    if (successfulData.length > 0) {
      return `\n\nExtracted information from images:\n${successfulData.join("\n---\n")}\n\n`;
    }
  } catch (error: unknown) {
    logger.error({ message: "Failed to process attached images", error });
  }

  return "";
}

export async function handleGetAllChatMessages(c: Context) {
  const userId = c.get("user");
  const { chatId } = c.get("param");

  const chat = await prisma.chat.findFirst({
    where: { id: chatId, userId },
    select: {
      id: true,
      title: true,
      ragStatus: true,
      isRag: true,
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
