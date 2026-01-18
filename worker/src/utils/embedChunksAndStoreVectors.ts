import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";

const embeddingsClient = new GoogleGenerativeAIEmbeddings({
  model: process.env.GOOGLE_EMBEDDINGS_MODEL!,
});

const pinecone = new Pinecone();
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

export async function embedChunksAndStoreVectors(chunks: Document<Record<string, any>>[], extraMetadata: Record<string, any>) {
  const chunksWithMeta = chunks.map((c) => ({
    pageContent: c.pageContent,
    metadata: { ...(c.metadata || {}), ...extraMetadata },
  }));

  await PineconeStore.fromDocuments(chunksWithMeta, embeddingsClient, { pineconeIndex: index });

  console.log(`Stored ${chunks.length} chunks in Pinecone.`);
}
