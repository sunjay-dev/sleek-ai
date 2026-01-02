import { ChatGroq } from "@langchain/groq";
import { createAgent, summarizationMiddleware } from "langchain";
import tools from "../tools/index.js";
import checkpointer from "../config/pgCheckpointer.config.js";
import { MODELS } from "../models.js";

const llmCache = new Map();
const summarizerCache = new Map();

const getLLM = (model: string) => {
  if (!llmCache.has(model)) {
    llmCache.set(model, new ChatGroq({ model, temperature: 0 }));
  }
  return llmCache.get(model);
};

const getSummarizer = () => {
  if (!summarizerCache.has("compound-mini")) {
    summarizerCache.set("compound-mini", new ChatGroq({ model: "groq/compound-mini" }));
  }
  return summarizerCache.get("compound-mini");
};

export const groqChatAgent = (model: string, temperature = 0) => {
  return new ChatGroq({
    model,
    temperature,
  });
};

export const createGroqAgent = (model: string, systemPrompt: string) => {
  const llm = getLLM(model);
  const summarizerLLM = getSummarizer();

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
