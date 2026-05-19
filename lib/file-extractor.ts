import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const SUPPORTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
] as const;

export const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt", ".csv", ".md", ".json"] as const;

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  filename: string,
): Promise<string> {
  // PDF
  if (mimeType === "application/pdf" || filename.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text.trim();
  }

  // DOCX
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword" ||
    filename.endsWith(".docx") ||
    filename.endsWith(".doc")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  // Plain text, CSV, Markdown, JSON
  if (
    mimeType.startsWith("text/") ||
    filename.endsWith(".txt") ||
    filename.endsWith(".csv") ||
    filename.endsWith(".md") ||
    filename.endsWith(".json")
  ) {
    return buffer.toString("utf-8").trim();
  }

  throw new Error(`Formato no soportado: ${mimeType || filename}`);
}
