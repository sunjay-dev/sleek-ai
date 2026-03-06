// import { ChatOpenRouter } from "@langchain/openrouter";
// import { createAgent, summarizationMiddleware } from "langchain";
// import tools from "../tools/index.js";
// import checkpointer from "./redisCheckpointer.config.js";
// import { MODELS } from "@app/shared/src/models.js";

// const llmCache = new Map();
// let summarizerCache: ChatOpenRouter | null = null;

// const MEMORY_MODEL = (process.env.MEMORY_MODEL as string) || "groq/compound-mini";
// const TITLE_MODEL = (process.env.TITLE_MODEL as string) || "groq/compound-mini";
// const SUMMARIZER_MODEL = (process.env.SUMMARIZER_MODEL as string) || "groq/compound-mini";

// const getLLM = (model: string) => {
//   if (!llmCache.has(model)) {
//     llmCache.set(model, openRouterChatAgent(model));
//   }
//   return llmCache.get(model);
// };

// const getSummarizer = () => {
//   if (!summarizerCache) {
//     summarizerCache = openRouterChatAgent(SUMMARIZER_MODEL);
//   }
//   return summarizerCache;
// };

// export const openRouterChatAgent = (model: string, temperature = 0) => {
//   return new ChatOpenRouter({
//     model,
//     temperature,
//   });
// };

// export const createOpenRouterAgent = (model: string, systemPrompt: string) => {
//   const llm = getLLM(model);
//   const summarizerLLM = getSummarizer();

//   const modelConfig = MODELS.find((m) => model === m.id);
//   const triggerTokens = modelConfig ? Math.floor(modelConfig.tpm * 0.5) : 3000;

//   return createAgent({
//     model: llm,
//     tools,
//     systemPrompt,
//     checkpointer,
//     middleware: [
//       summarizationMiddleware({
//         model: summarizerLLM,
//         trigger: {
//           tokens: triggerTokens,
//           fraction: 0.75,
//         },
//         keep: { fraction: 0.25 },
//       }),
//     ],
//   });
// };

// export const memoryLLM = openRouterChatAgent(MEMORY_MODEL);

// export const titleLLM = openRouterChatAgent(TITLE_MODEL, 0.6);
