import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { workerEnv } from "../config/env.config.js";

export async function getVectorStore() {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: workerEnv.GOOGLE_EMBEDDINGS_MODEL,
  });

  const pinecone = new Pinecone({
    apiKey: workerEnv.PINECONE_API_KEY,
  });

  const index = pinecone.Index(workerEnv.PINECONE_INDEX_NAME);

  return { vectorStore: await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index as never }), pinecone };
}
