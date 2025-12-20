import { HumanMessage } from "langchain";
import { createGroqAgent } from "../config/groq.config.js";

export const getAIResponse = async (prompt: string, threadId: string, modelName: string) => {
  const agent = createGroqAgent(modelName);
  const config = { configurable: { thread_id: threadId } };

  const result = await agent.invoke({ messages: [new HumanMessage(prompt)] }, config);

  const lastMessage = result.messages[result.messages.length - 1];

  return lastMessage.content;
};
