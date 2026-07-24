import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { type Document } from "@langchain/core/documents";
import logger from "./logger.utils.js";
import { workerEnv } from "../config/env.config.js";

const embeddingsClient = new GoogleGenerativeAIEmbeddings({
  model: workerEnv.GOOGLE_EMBEDDINGS_MODEL,
});

const pinecone = new Pinecone();
const index = pinecone.Index(workerEnv.PINECONE_INDEX_NAME);

export async function embedChunksAndStoreVectors(chunks: Document<Record<string, unknown>>[], extraMetadata: Record<string, unknown>) {
  const cleanChunks = chunks
    .map((c) => {
      if (typeof c.pageContent !== "string") return c;
      const cleanedText = c.pageContent
        .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, "")
        .replace(/[-=_]{3,}/g, "")
        .replace(/\|[^|]*\|/g, (match) => match.replace(/[|]/g, " "))
        .replace(/[^\S\n]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      return { ...c, pageContent: cleanedText };
    })
    .filter((c) => typeof c.pageContent === "string" && c.pageContent.trim().length > 10);

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

  const store = new PineconeStore(embeddingsClient, { pineconeIndex: index as never });

  const textsToEmbed = chunksWithMeta.map((c) => c.pageContent);

  let embeddings: number[][];

  try {
    embeddings = await embeddingsClient.embedDocuments(textsToEmbed);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown Embeddings API error";
    logger.error({
      message: "Google GenAI Embeddings API threw an explicit error",
      error: errorMessage,
      details: err,
    });
    throw err;
  }

  const validEmbeddings: number[][] = [];
  const validDocuments: Document<Record<string, unknown>>[] = [];

  for (let i = 0; i < embeddings.length; i++) {
    const vector = embeddings[i];
    if (vector && vector.length > 0) {
      validEmbeddings.push(vector);
      validDocuments.push(chunksWithMeta[i]);
    } else {
      logger.warn({
        message: "Google GenAI returned an empty vector (likely safety bounded)",
        chunkPreview: chunksWithMeta[i].pageContent.substring(0, 100),
      });
    }
  }

  if (validEmbeddings.length === 0) {
    throw new Error("Google GenAI returned 0 valid embeddings for this document. It may have been blocked by safety filters.");
  }

  await store.addVectors(validEmbeddings, validDocuments);
}
