import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

export async function chunkFile(docs: Document[] | string[], chunkSize = 500, chunkOverlap = 50): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 200,
  });

  const docObjects: Document[] = docs.map((d) => {
    if (typeof d === "string") return new Document({ pageContent: d });
    return d;
  });

  const chunks = await splitter.splitDocuments(docObjects);
  return chunks;
}
