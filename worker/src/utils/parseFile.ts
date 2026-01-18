import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import fs from "fs";

export async function parseFileWithLangChain(fileUrl: string, fileType?: string) {
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
  const buffer = await res.arrayBuffer();

  const fileContent = Buffer.from(buffer);

  const tempPath = `./tmp/${Date.now()}_${fileType || "file"}`;
  fs.writeFileSync(tempPath, fileContent);

  let loader;
  switch (fileType) {
    case "pdf":
      loader = new PDFLoader(tempPath);
      break;
    case "docx":
      loader = new DocxLoader(tempPath);
      break;
    case "txt":
    default:
      loader = new TextLoader(tempPath);
  }

  const docs = await loader.load();
  fs.unlinkSync(tempPath);

  return docs;
}
