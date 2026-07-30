import { ChatOpenAI } from "@langchain/openai";
import { createAgent, summarizationMiddleware } from "langchain";
import tools from "../tools/index.js";
import { getRedisCheckpointer } from "./redisCheckpointer.config.js";
import { backendEnv } from "./env.config.js";

const llmCache = new Map();
let summarizerCache: ChatOpenAI | null = null;

const MEMORY_MODEL = backendEnv.MEMORY_MODEL;
const TITLE_MODEL = backendEnv.TITLE_MODEL;
const SUMMARIZER_MODEL = backendEnv.SUMMARIZER_MODEL;
const CHAT_MODEL = backendEnv.CHAT_MODEL;

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

export const chatAgent = (model: string, temperature?: number) => {
  return new ChatOpenAI({
    model,
    temperature: temperature ?? backendEnv.DEFAULT_TEMPERATURE,
    apiKey: backendEnv.ROUTER_API_KEY,
    configuration: {
      baseURL: backendEnv.ROUTER_BASE_URL,
    },
  });
};

let cachedAgent: ReturnType<typeof createAgent> | null = null;

export const createAgentFromRouter = async () => {
  if (cachedAgent) return cachedAgent;

  const llm = getLLM(CHAT_MODEL);
  const summarizerLLM = getSummarizer();
  const checkpointer = await getRedisCheckpointer();

  const triggerTokens = backendEnv.SUMMARIZER_TRIGGER_TOKENS;
  const keepTokens = backendEnv.SUMMARIZER_KEEP_TOKENS;

  cachedAgent = createAgent({
    model: llm,
    tools,
    checkpointer,
    middleware: [
      summarizationMiddleware({
        model: summarizerLLM,
        trigger: {
          tokens: triggerTokens,
        },
        keep: { tokens: keepTokens },
      }),
    ],
  });

  return cachedAgent;
};

export const memoryLLM = chatAgent(MEMORY_MODEL);

export const titleLLM = chatAgent(TITLE_MODEL, backendEnv.TITLE_TEMPERATURE);
