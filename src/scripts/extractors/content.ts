import * as cheerio from "cheerio";

export function extractSummary(
  html: string,
  maxLength = 160
): string {
  try {
    const $ = cheerio.load(html);
    const text = $.text()
      .replace(/\s+/g, " ")
      .trim();

    if (text.length <= maxLength) {
      return text;
    }

    const trimmed = text.slice(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(" ");

    if (lastSpace === -1) {
      return trimmed + "...";
    }

    return trimmed.slice(0, lastSpace) + "...";
  } catch {
    return html.replace(/\s+/g, " ").trim().slice(0, maxLength) + "...";
  }
}
