import { ChatGroq } from "@langchain/groq";
import { createAgent, summarizationMiddleware } from "langchain";
import tools from "../tools/index.js";
import { systemPrompt } from "../prompts/system.prompt.js";
import checkpointer from "../config/pgCheckpointer.config.js";
import { MODELS } from "../models.js";

export const groqChatAgent = (model: string, temperature = 0) => {
  return new ChatGroq({
    model,
    temperature,
  });
};

export const createGroqAgent = (model: string) => {
  const llm = groqChatAgent(model);
  const summarizerLLM = groqChatAgent("groq/compound-mini");

  const modelConfig = MODELS.get(model);
  const triggerTokens = modelConfig ? Math.floor(modelConfig.tpm * 0.5) : 3000;

  return createAgent({
    model: llm,
    tools,
    systemPrompt,
    checkpointer,
    middleware: [
      summarizationMiddleware({
        model: summarizerLLM,
        trigger: {
          tokens: triggerTokens,
          fraction: 0.75,
        },
        keep: { fraction: 0.25 },
      }),
    ],
  });
};
