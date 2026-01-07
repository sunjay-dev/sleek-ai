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
