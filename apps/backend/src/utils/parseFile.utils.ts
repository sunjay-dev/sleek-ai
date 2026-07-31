import pdf from "pdf-parse";
import mammoth from "mammoth";
import logger from "@app/logger";
import { fileTypeFromBuffer } from "file-type";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_CONTENT_LENGTH = 200_000;

const ALLOWED_MIMES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/csv",
  "text/plain",
]);

export type ParseResult = {
  content: string;
  truncated: boolean;
  fileName: string;
};

async function fetchFile(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function truncateContent(content: string, fileName: string): ParseResult {
  if (content.length <= MAX_CONTENT_LENGTH) {
    return { content: content.trim(), truncated: false, fileName };
  }
  return {
    content: content.slice(0, MAX_CONTENT_LENGTH) + "\n\n[Content truncated...]",
    truncated: true,
    fileName,
  };
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

export async function parseFileContent(fileUrl: string, fileType: string): Promise<ParseResult | null> {
  if (fileType.includes("image")) return null;

  try {
    const buffer = await fetchFile(fileUrl);

    if (buffer.length > MAX_FILE_SIZE) {
      logger.warn({ message: "File too large, skipping content extraction", size: buffer.length });
      return null;
    }

    const detected = await fileTypeFromBuffer(buffer);
    if (detected && !ALLOWED_MIMES.has(detected.mime)) {
      logger.warn({ message: "File type mismatch (magic bytes)", declared: fileType, detected: detected.mime });
      return null;
    }

    const fileName = fileUrl.split("/").pop() || "unknown";
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

    return truncateContent(content, fileName);
  } catch (error) {
    logger.error({ message: "Failed to parse file", fileType, error });
    return null;
  }
}
