import { TavilySearch } from "@langchain/tavily";

export const InternetSearch = new TavilySearch({
  maxResults: 3,
  topic: "general",
  searchDepth: "basic",
  includeRawContent: false,
  includeAnswer: true,

  // includeAnswer: false,
  // includeRawContent: false,
  // includeImages: false,
  // includeImageDescriptions: false,
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});

InternetSearch.description =
  "A search engine optimized for comprehensive, accurate, and trusted results. ONLY use this tool if you absolutely need real-time data, recent news, or highly specific facts not in your training data. Do NOT use this tool for general knowledge, coding syntax, historical facts, or casual conversation.";
