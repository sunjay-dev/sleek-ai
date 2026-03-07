import { tool } from "@langchain/core/tools";
import { z } from "@app/shared/src/index.js";
import { vectorStore } from "../config/vectorStore.config.js";
import logger from "../utils/logger.utils.js";
import { RunnableConfig } from "@langchain/core/runnables";

const searchUploadedDocumentsSchema = z.object({
    query: z.string().describe("The search query to find relevant information from the uploaded documents in the current chat."),
});

export const searchUploadedDocuments = tool(
    async (input, config?: RunnableConfig) => {
        try {
            const chatId = config?.configurable?.thread_id;

            if (!chatId) {
                logger.warn("search_uploaded_documents tool called without a thread_id in config.");
                return "Error: Could not determine the current chat context to search documents.";
            }

            logger.info({ message: "Executing AI-driven vector search", query: input.query, chatId });

            const results = await vectorStore.similaritySearch(input.query, 4, {
                chatId: chatId,
            });

            if (!results || results.length === 0) {
                return "No relevant information found in the uploaded documents for this query.";
            }

            const context = results.map((r) => r.pageContent).join("\n\n---\n\n");
            return `Context Information from uploaded documents: \n\n${context} `;

        } catch (error) {
            logger.error({ message: "AI vector search failed", error, query: input.query });
            return "An error occurred while searching the documents. Please try again or inform the user.";
        }
    },
    {
        name: "search_uploaded_documents",
        description: "Search the uploaded documents within the current chat for specific information or context. Use this tool whenever the user asks about the content of their uploaded files, PDFs, presentations, or documents.",
        schema: searchUploadedDocumentsSchema,
    }
);
