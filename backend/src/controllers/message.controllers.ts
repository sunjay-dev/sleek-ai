import { type Context } from "hono";
import { extractFactualMemory, generateAIResponse } from "../utils/model.utils.js";
import prisma from "../config/prisma.config.js";
import { InternalServerError } from "../utils/appError.utils.js";
import { streamText } from "hono/streaming";
import logger from "../utils/logger.utils.js";

export async function handleUserMessageResponse(c: Context) {
  const requestStartTime = new Date();

  const { chatId } = c.get("param");
  const userId = c.get("user");
  const { query, model } = c.get("body");
  const timezone = c.req.header("x-client-timezone") || "UTC";

  try {
    const [chat, preferences, memories] = await Promise.all([
      prisma.chat.findFirst({ where: { id: chatId, userId }, select: { id: true } }),
      prisma.userPreference.upsert({ where: { userId }, create: { userId }, update: {} }),
      prisma.userMemory.findMany({ where: { userId }, select: { content: true } }),
    ]);

    if (!chat) {
      return c.json({ error: "Chat not found or unauthorized" }, 404);
    }

    return streamText(c, async (stream) => {
      let fullResponse = "";

      try {
        const aiStream = generateAIResponse({
          query,
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

        await prisma.chat.update({
          where: { id: chatId },
          data: {
            updatedAt: requestStartTime,
            messages: {
              create: [
                { text: query, role: "USER", createdAt: requestStartTime },
                { text: fullResponse, role: "ASSISTANT" },
              ],
            },
          },
        });

        setImmediate(() => {
          extractFactualMemory(query, memories)
            .then((newMemories) => {
              if (!newMemories.length) return;

              return prisma.userMemory.createMany({
                data: newMemories.map((memory) => ({
                  userId,
                  content: memory.content,
                })),
              });
            })
            .catch((err) => {
              logger.error("Memory extraction failed", err);
            });
        });
      } catch (error) {
        logger.error({ message: "Streaming error:", error });
        await stream.write("\n\n[Error: Response generation interrupted]");
      }
    });
  } catch (error) {
    throw new InternalServerError("Error occured while handling AI response", { error });
  }
}

export async function handleGetAllChatMessages(c: Context) {
  const userId = c.get("user");
  const { chatId } = c.get("param");

  try {
    const messages = await prisma.chat.findFirst({
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
          },
        },
      },
    });

    if (!messages) {
      return c.json({ message: "Chat not found or unauthorized" }, 400);
    }

    return c.json(messages, 200);
  } catch (error) {
    throw new InternalServerError("Error fetching chat messages", { error });
  }
}
