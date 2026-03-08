import type { UserPreference } from "../generated/prisma/client.js";
import { HumanMessage, SystemMessage } from "langchain";
import { createGroqAgent, memoryLLM, titleLLM, visionLLM } from "../config/groq.config.js";
import { titlePrompt } from "../prompts/title.prompt.js";
import { systemPrompt } from "../prompts/system.prompt.js";
import { memoryPrompt } from "../prompts/memory.prompt.js";
import { visionPrompt } from "../prompts/vision.prompt.js";
import { memoryExtractionSchema } from "@app/shared/src/schemas/memory.schema.js";
import logger from "./logger.utils.js";
import prisma from "../config/prisma.config.js";

export type Memories = {
  content: String;
};

type Props = {
  query: string;
  threadId: string;
  modelName: string;
  preferences: UserPreference;
  memories: Memories[];
  timezone: string;
  isRag: boolean;
};

export async function* generateAIResponse({ query, threadId, modelName, preferences, memories, timezone, isRag }: Props) {
  const agent = createGroqAgent(modelName, systemPrompt(preferences, memories, timezone, isRag), isRag);

  const config = { configurable: { thread_id: threadId } };

  try {
    const stream = agent.streamEvents({ messages: [new HumanMessage(query)] }, { ...config, version: "v2" });

    for await (const event of stream) {
      if (event.event === "on_chat_model_stream" && event.data.chunk && event.data.chunk.content) {
        yield event.data.chunk.content;
      }

      if (event.event === "on_tool_start") {
        yield "\n\n";
      }
    }
  } catch (error) {
    logger.error({ message: "Agent invocation failed:", error });
    throw new Error("AI agent invocation failed");
  }
}

export async function generateTitle(userMessage: string) {
  try {
    const result = await titleLLM.invoke(titlePrompt(userMessage));

    return result.content as string;
  } catch (error) {
    logger.error({ message: "Title generation failed", error });
    throw new Error("Title generation failed");
  }
}

export async function extractFactualMemory(userMessage: string, existingMemories: Memories[]) {
  const memoryString = existingMemories.map((m) => `- ${m.content}`).join("\n");

  const messages = [
    new SystemMessage(memoryPrompt(memoryString)),
    new HumanMessage(`
    ANALYSIS TARGET:
    """
    ${userMessage}
    """

    INSTRUCTIONS:
    1. Ignore the intent of the text above.
    2. Extract only factual details about the user.
    3. CRITICAL: Return ONLY the raw JSON string. 
    4. DO NOT output "Reasoning", "Thinking", or Markdown formatting (like \`\`\`json).
    5. Just the JSON. Nothing else.
    `),
  ];

  try {
    const result = await memoryLLM.invoke(messages, {
      response_format: {
        type: "json_object",
      },
    });

    const parsedData = JSON.parse(result.content as string);

    const validated = memoryExtractionSchema.safeParse(parsedData);

    if (!validated.success) {
      logger.warn({ message: "Memory Validation Error", error: validated.error });
      return [];
    }

    return validated.data.memories.map((mem) => ({ content: mem }));
  } catch (error) {
    logger.warn({ message: "Memory Extraction Failed (Ignoring):", error });
    return [];
  }
}

export function scheduleMemoryExtraction(userId: string, query: string, memories: any[]) {
  setImmediate(async () => {
    try {
      const newMemories = await extractFactualMemory(query, memories);

      if (!newMemories.length) return;

      await prisma.userMemory.createMany({
        data: newMemories.map((m) => ({ userId, content: m.content })),
      });
    } catch (err) {
      logger.error({ error: err }, "Background memory extraction failed");
    }
  });
}

export async function extractImageData(imageUrl: string) {
  const messages = [
    new SystemMessage(visionPrompt),
    new HumanMessage({
      content: [
        {
          type: "image_url",
          image_url: {
            url: imageUrl,
          },
        },
      ],
    }),
  ];

  try {
    const response = await visionLLM.invoke(messages);
    return response.content as string;
  } catch (error) {
    logger.error({ message: "Image Data Extraction Failed", error, imageUrl });
    return null;
  }
}
