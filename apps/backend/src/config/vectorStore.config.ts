import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { backendEnv } from "./env.config.js";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: backendEnv.GOOGLE_EMBEDDINGS_MODEL,
  apiKey: backendEnv.GOOGLE_API_KEY,
});

export const pinecone = new Pinecone({
  apiKey: backendEnv.PINECONE_API_KEY,
});

export const index = pinecone.Index({ name: backendEnv.PINECONE_INDEX_NAME });

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex: index,
});
