import { createGroqAgent } from "../config/groq.config.js";

export const askAI = async (prompt: string, userId: string, modelName: string) => {
  const agent = createGroqAgent(modelName);
  const config = { configurable: { thread_id: userId } };

  const result = await agent.invoke({ messages: [{ role: "user", content: prompt }] }, config);

  const lastMessage = result.messages[result.messages.length - 1];
  return lastMessage.content;
};

export const streamAskAI = async (prompt: string, userId: string, modelName: string) => {
  const agent = createGroqAgent(modelName);
  const config = { configurable: { thread_id: userId } };

  const eventStream = agent.streamEvents({ messages: [{ role: "user", content: prompt }] }, { ...config, version: "v2" });

  return eventStream;
};
