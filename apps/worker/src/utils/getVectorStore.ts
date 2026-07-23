import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export async function getVectorStore() {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: process.env.GOOGLE_EMBEDDINGS_MODEL as string,
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME as string);

  return { vectorStore: await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index }), pinecone };
}
