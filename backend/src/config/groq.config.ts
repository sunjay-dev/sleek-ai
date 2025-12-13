import { ChatGroq } from "@langchain/groq";
import { createAgent, summarizationMiddleware } from "langchain";
import tools from "../tools/index.js";
import { systemPrompt } from "../prompts/system.prompt.js";
import redisCheckpointer from "./redis.config.js";

const chatAgent = (model: string, temperature = 0) => {
  return new ChatGroq({
    model,
    temperature,
  });
};

export const createGroqAgent = (model: string) => {
  const llm = chatAgent(model);
  const summarizerLLM = chatAgent("openai/gpt-oss-20b");

  return createAgent({
    model: llm,
    tools,
    systemPrompt,
    checkpointer: redisCheckpointer,
    middleware: [
      summarizationMiddleware({
        model: summarizerLLM,
        trigger: { tokens: 4000 },
        keep: { messages: 10 },
      }),
    ],
  });
};
