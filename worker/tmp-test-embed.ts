import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

async function test() {
    const embeddingsClient = new GoogleGenerativeAIEmbeddings({
        model: process.env.GOOGLE_EMBEDDINGS_MODEL as string,
    });

    try {
        console.log("Using model:", process.env.GOOGLE_EMBEDDINGS_MODEL);
        const res = await embeddingsClient.embedDocuments(["Hello world", "This is a test"]);
        console.log("Embeddings successfully retrieved!");
        console.log("Returned dimensions for chunk 1: " + res[0]?.length);
        console.log("Returned dimensions for chunk 2: " + res[1]?.length);
    } catch (err) {
        console.error("Embedding error:", err);
    }
}
test();
