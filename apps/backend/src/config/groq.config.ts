// @deprecated - This file is kept for backward compatibility.
// All LLM logic now lives in llm.config.ts using 9router (OpenAI-compatible).
// Import from llm.config.ts instead.
export { chatAgent as groqChatAgent, createAgentFromRouter as createGroqAgent, memoryLLM, titleLLM } from "./llm.config.js";
