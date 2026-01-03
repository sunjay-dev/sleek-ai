import type { UserPreference } from "../generated/prisma/client.js";
import { HumanMessage, SystemMessage } from "langchain";
import { createGroqAgent, groqChatAgent } from "../config/groq.config.js";
import { titlePrompt } from "../prompts/title.prompt.js";
import { systemPrompt } from "../prompts/system.prompt.js";
import { memoryPrompt } from "../prompts/memory.prompt.js";
import { memoryExtractionSchema } from "../schemas/memory.schema.js";

export type Memories = {
  content: String;
};

type Props = {
  query: string;
  threadId: string;
  modelName: string;
  preferences: UserPreference;
  memories: Memories[];
};

export async function generateAIResponse({ query, threadId, modelName, preferences, memories }: Props) {
  const agent = createGroqAgent(modelName, systemPrompt(preferences, memories));

  const config = { configurable: { thread_id: threadId } };

  let result;
  try {
    result = await agent.invoke({ messages: [new HumanMessage(query)] }, config);
  } catch (err) {
    console.error("Agent invocation failed:", err);
    throw new Error("AI agent invocation failed");
  }

  if (!result || !Array.isArray(result.messages) || result.messages.length === 0) {
    throw new Error("Empty messages returned by AI agent");
  }

  const lastMessage = result.messages[result.messages.length - 1];

  if (!lastMessage || !lastMessage.content) {
    throw new Error("Missing content in AI agent response");
  }

  return lastMessage.content as string;
}

const titleLLM = groqChatAgent("groq/compound-mini");

export async function generateTitle(userMessage: string) {
  const result = await titleLLM.invoke(titlePrompt(userMessage));

  return result.content as string;
}

const memoryLLM = groqChatAgent("groq/compound-mini");

export async function extractFactualMemory(userMessage: string, existingMemories: { content: string }[]) {
  const memoryString = existingMemories.map((m) => `- ${m.content}`).join("\n");

  const messages = [new SystemMessage(memoryPrompt(memoryString)), new HumanMessage(userMessage)];

  const result = await memoryLLM.invoke(messages);

  if (!result?.content) return [];

  let parsed;
  try {
    const cleanContent = (result.content as String).replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleanContent);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return [];
  }

  const validated = memoryExtractionSchema.safeParse(parsed);

  if (!validated.success) {
    console.error("Validation Error:", validated.error);
    return [];
  }

  return validated.data.memories.map((mem) => ({ content: mem }));
}
