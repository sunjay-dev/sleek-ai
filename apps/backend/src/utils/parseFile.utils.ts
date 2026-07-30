import pdf from "pdf-parse";
import mammoth from "mammoth";
import logger from "@app/logger";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_CONTENT_LENGTH = 100_000; // ~25k tokens

async function fetchFile(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function truncateContent(content: string): string {
  if (content.length <= MAX_CONTENT_LENGTH) return content;
  return content.slice(0, MAX_CONTENT_LENGTH) + "\n\n[Content truncated...]";
}

async function parsePdf(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function parseText(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

function parseCsv(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

export async function parseFileContent(fileUrl: string, fileType: string): Promise<string | null> {
  if (fileType.includes("image")) return null;

  try {
    const buffer = await fetchFile(fileUrl);

    if (buffer.length > MAX_FILE_SIZE) {
      logger.warn({ message: "File too large, skipping content extraction", size: buffer.length });
      return null;
    }

    let content: string;

    if (fileType.includes("pdf")) {
      content = await parsePdf(buffer);
    } else if (fileType.includes("word") || fileType.includes("docx")) {
      content = await parseDocx(buffer);
    } else if (fileType.includes("csv")) {
      content = parseCsv(buffer);
    } else {
      content = parseText(buffer);
    }

    return truncateContent(content.trim());
  } catch (error) {
    logger.error({ message: "Failed to parse file", fileType, error });
    return null;
  }
}
