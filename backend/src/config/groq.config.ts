import { ChatGroq } from "@langchain/groq";
import { createAgent, summarizationMiddleware } from "langchain";
import tools from "../tools/index.js";
import checkpointer from "./redisCheckpointer.config.js";
import { MODELS } from "@app/shared/src/models.js";

const llmCache = new Map();
let summarizerCache: ChatGroq | null = null;

const MEMORY_MODEL = (process.env.MEMORY_MODEL as string) || "groq/compound-mini";
const TITLE_MODEL = (process.env.TITLE_MODEL as string) || "groq/compound-mini";
const SUMMARIZER_MODEL = (process.env.SUMMARIZER_MODEL as string) || "groq/compound-mini";
const VISION_MODEL = (process.env.VISION_MODEL as string) || "meta-llama/llama-4-scout-17b-16e-instruct";

const getLLM = (model: string) => {
  if (!llmCache.has(model)) {
    llmCache.set(model, groqChatAgent(model));
  }
  return llmCache.get(model);
};

const getSummarizer = () => {
  if (!summarizerCache) {
    summarizerCache = groqChatAgent(SUMMARIZER_MODEL);
  }
  return summarizerCache;
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

  const modelConfig = MODELS.find((m) => model === m.id);
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

export const memoryLLM = groqChatAgent(MEMORY_MODEL);

export const titleLLM = groqChatAgent(TITLE_MODEL, 0.6);

export const visionLLM = groqChatAgent(VISION_MODEL);
