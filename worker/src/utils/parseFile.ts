import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import fs from "fs";
import path from "path";

export async function parseFileWithLangChain(fileUrl: string) {
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
  const buffer = await res.arrayBuffer();

  const contentType = res.headers.get("content-type") || "";
  let ext = ".bin";

  if (contentType.includes("pdf")) ext = ".pdf";
  else if (contentType.includes("text")) ext = ".txt";
  else if (contentType.includes("word")) ext = ".docx";
  else if (contentType.includes("presentation")) ext = ".pptx";
  else if (contentType.includes("csv")) ext = ".csv";

  const fileContent = Buffer.from(buffer);

  const tmpDir = path.resolve("./tmp");

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const tempPath = path.join(tmpDir, `${Date.now()}${ext}`);

  fs.writeFileSync(tempPath, fileContent);

  let loader;
  switch (ext) {
    case ".pdf":
      loader = new PDFLoader(tempPath);
      break;
    case ".docx":
      loader = new DocxLoader(tempPath);
      break;
    case ".pptx":
      loader = new PPTXLoader(tempPath);
      break;
    case ".csv":
      loader = new CSVLoader(tempPath);
      break;
    case ".txt":
    default:
      loader = new TextLoader(tempPath);
  }

  const docs = await loader.load();
  fs.unlinkSync(tempPath);

  return docs;
}
