import { HumanMessage } from "langchain";
import { createGroqAgent, groqChatAgent } from "../config/groq.config.js";
import { titlePrompt } from "../prompts/title.prompt.js";

export const getAIResponse = async (prompt: string, threadId: string, modelName: string) => {
  const agent = createGroqAgent(modelName);
  const config = { configurable: { thread_id: threadId } };

  const result = await agent.invoke({ messages: [new HumanMessage(prompt)] }, config);

  const lastMessage = result.messages[result.messages.length - 1];

  return lastMessage.content as string;
};

const titleLLM = groqChatAgent("groq/compound-mini");

export const generateTitle = async (userMessage: string) => {
  const result = await titleLLM.invoke(titlePrompt(userMessage));

  return result.content as string;
};
