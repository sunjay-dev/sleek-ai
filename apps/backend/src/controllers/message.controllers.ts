import { type Context } from "hono";
import { streamSSE, type SSEStreamingApi } from "hono/streaming";
import { scheduleMemoryExtraction, generateAIResponse } from "../utils/model.utils.js";
import prisma from "@app/db";
import { NotFoundError } from "../utils/appError.utils.js";
import logger from "@app/logger";
import { streamLoading, streamText, streamError, streamStatus } from "../utils/stream.utils.js";
import { parseFileContent } from "../utils/parseFile.utils.js";
import type { UploadedFile } from "@app/shared";

export async function handleUserMessageResponse(c: Context) {
  const requestStartTime = new Date();
  const { chatId } = c.req.param();
  const userId = c.get("user");
  const { query, messageFiles } = c.get("body");
  const timezone = c.req.header("x-client-timezone") || "UTC";

  return streamSSE(c, async (stream: SSEStreamingApi) => {
    let fullResponse = "";
    const finalQuery = query || "Please summarize or describe the uploaded document.";

    const imageUrls =
      messageFiles?.filter((file: UploadedFile) => file.fileType?.includes("image") && file.fileUrl).map((file: UploadedFile) => file.fileUrl) || [];

    const documentFiles = messageFiles?.filter((file: UploadedFile) => !file.fileType?.includes("image") && file.fileUrl) || [];

    let fileContent: string | undefined;
    if (documentFiles.length > 0) {
      await streamStatus(stream, "extracting content...");
      const results = await Promise.all(documentFiles.map((file: UploadedFile) => parseFileContent(file.fileUrl, file.fileType)));
      const validResults = results.filter((r): r is NonNullable<typeof r> => r !== null);
      if (validResults.length > 0) {
        const truncatedFiles = validResults.filter((r) => r.truncated).map((r) => r.fileName);
        if (truncatedFiles.length > 0) {
          await streamStatus(stream, `files truncated (too large for context): ${truncatedFiles.join(", ")}`);
        }
        fileContent = validResults.map((r) => r.content).join("\n\n---\n\n");
      }
    }

    try {
      const [chat, preferences, memories] = await Promise.all([
        prisma.chat.findUnique({ where: { id: chatId, userId }, select: { id: true } }),
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
        preferences,
        memories,
        timezone,
        imageUrls,
        fileContent,
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
