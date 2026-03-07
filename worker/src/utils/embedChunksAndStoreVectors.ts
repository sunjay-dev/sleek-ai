import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { type Document } from "@langchain/core/documents";
import logger from "./logger.utils.js";

const embeddingsClient = new GoogleGenerativeAIEmbeddings({
  model: process.env.GOOGLE_EMBEDDINGS_MODEL as string,
});

const pinecone = new Pinecone();
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME as string);

export async function embedChunksAndStoreVectors(chunks: Document<Record<string, any>>[], extraMetadata: Record<string, any>) {
  const cleanChunks = chunks
    .map((c) => {
      if (typeof c.pageContent !== "string") return c;
      const cleanedText = c.pageContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
      return { ...c, pageContent: cleanedText };
    })
    .filter((c) => typeof c.pageContent === "string" && c.pageContent.length > 0);

  if (!cleanChunks.length) {
    throw new Error("No valid chunks to embed");
  }

  logger.info({ message: "Embedding chunks...", chunkCount: cleanChunks.length });

  const chunksWithMeta = cleanChunks.map((c) => ({
    pageContent: c.pageContent,
    metadata: {
      ...extraMetadata,
      page: c.metadata?.pageNumber,
      fromLine: c.metadata?.fromLine,
      toLine: c.metadata?.toLine,
    },
  }));

  logger.info({ message: "First chunk preview", preview: chunksWithMeta[0]?.pageContent.substring(0, 100) });

  await PineconeStore.fromDocuments(chunksWithMeta, embeddingsClient, { pineconeIndex: index });

  logger.info({ message: "Stored chunks in Pinecone.", chunks: chunks.length });
}
