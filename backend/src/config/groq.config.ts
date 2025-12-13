import { ChatGroq } from "@langchain/groq";
import { createAgent, summarizationMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import tools from "../tools/index.js";
import { systemPrompt } from "../prompts/system.prompt.js";

const checkpointer = new MemorySaver();

const createGroqAgent = (modelId: string) => {
  const llm = new ChatGroq({
    model: modelId,
    temperature: 0,
  });

  const summarizerLLM = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0,
  });

  return createAgent({
    model: llm,
    tools,
    systemPrompt,
    checkpointer,
    middleware: [
      summarizationMiddleware({
        model: summarizerLLM,
        trigger: { tokens: 4000 },
        keep: { messages: 10 },
      }),
    ],
  });
};

export const askAI = async (prompt: string, userId: string, modelId: string) => {
  const agent = createGroqAgent(modelId);
  const config = { configurable: { thread_id: userId } };

  const result = await agent.invoke({ messages: [{ role: "user", content: prompt }] }, config);

  const lastMessage = result.messages[result.messages.length - 1];
  return lastMessage.content;
};

export const streamAskAI = async (prompt: string, userId: string, modelId: string) => {
  const agent = createGroqAgent(modelId);
  const config = { configurable: { thread_id: userId } };

  const eventStream = agent.streamEvents({ messages: [{ role: "user", content: prompt }] }, { ...config, version: "v2" });

  return eventStream;
};
