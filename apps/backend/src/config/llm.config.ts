import { ChatOpenAI } from "@langchain/openai";
import { createAgent, summarizationMiddleware } from "langchain";
import tools from "../tools/index.js";
import checkpointer from "./redisCheckpointer.config.js";
import { MODELS } from "@app/shared";
import { backendEnv } from "./env.config.js";

const llmCache = new Map();
let summarizerCache: ChatOpenAI | null = null;

const MEMORY_MODEL = backendEnv.MEMORY_MODEL;
const TITLE_MODEL = backendEnv.TITLE_MODEL;
const SUMMARIZER_MODEL = backendEnv.SUMMARIZER_MODEL;
const VISION_MODEL = backendEnv.VISION_MODEL;

const getLLM = (model: string) => {
  if (!llmCache.has(model)) {
    llmCache.set(model, chatAgent(model));
  }
  return llmCache.get(model);
};

const getSummarizer = () => {
  if (!summarizerCache) {
    summarizerCache = chatAgent(SUMMARIZER_MODEL);
  }
  return summarizerCache;
};

export const chatAgent = (model: string, temperature = 0) => {
  return new ChatOpenAI({
    model,
    temperature,
    apiKey: backendEnv.ROUTER_API_KEY,
    configuration: {
      baseURL: backendEnv.ROUTER_BASE_URL,
    },
  });
};

export const createAgentFromRouter = (model: string, systemPrompt: string, isRag: boolean = false) => {
  const llm = getLLM(model);
  const summarizerLLM = getSummarizer();

  const modelConfig = MODELS.find((m: (typeof MODELS)[number]) => model === m.id);
  const triggerTokens = modelConfig ? Math.floor(modelConfig.tpm * 0.5) : 3000;

  const agentTools = isRag ? tools : tools.filter((t) => t.name !== "search_uploaded_documents");

  return createAgent({
    model: llm,
    tools: agentTools,
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

export const memoryLLM = chatAgent(MEMORY_MODEL);

export const titleLLM = chatAgent(TITLE_MODEL, 0.6);

export const visionLLM = chatAgent(VISION_MODEL);
