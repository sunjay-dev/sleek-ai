import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: process.env.GOOGLE_EMBEDDINGS_MODEL as string,
  apiKey: process.env.GOOGLE_API_KEY as string,
});

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

export const index = pinecone.Index({ name: process.env.PINECONE_INDEX_NAME as string });

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex: index,
});
