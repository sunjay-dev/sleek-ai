import type { UserPreference } from "../generated/prisma/client.js";
import { HumanMessage } from "langchain";
import { createGroqAgent, groqChatAgent } from "../config/groq.config.js";
import { titlePrompt } from "../prompts/title.prompt.js";
import { systemPrompt } from "../prompts/system.prompt.js";

export const generateAIResponse = async (prompt: string, threadId: string, modelName: string, preferences: UserPreference): Promise<string> => {
  const agent = createGroqAgent(modelName, systemPrompt(preferences));
  const config = { configurable: { thread_id: threadId } };

  let result;
  try {
    result = await agent.invoke({ messages: [new HumanMessage(prompt)] }, config);
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
};

const titleLLM = groqChatAgent("groq/compound-mini");

export const generateTitle = async (userMessage: string) => {
  const result = await titleLLM.invoke(titlePrompt(userMessage));

  return result.content as string;
};
