import { ChatGroq } from "@langchain/groq";
import { createAgent, summarizationMiddleware } from "langchain";
import tools from "../tools/index.js";
import { systemPrompt } from "../prompts/system.prompt.js";
import checkpointer from "../config/pgCheckpointer.config.js";

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
    checkpointer,
    middleware: [
      summarizationMiddleware({
        model: summarizerLLM,
        trigger: {
          tokens: 4000,
          fraction: 0.75,
        },
        keep: { fraction: 0.25 },
      }),
    ],
  });
};
