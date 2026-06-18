import * as cheerio from "cheerio";

const FALLBACK_IMAGE = "/api/placeholder";

export function extractImage(item: Record<string, unknown>): string {
  try {
    if (item.enclosure && typeof item.enclosure === "object" && item.enclosure !== null) {
      const enc = item.enclosure as Record<string, unknown>;
      if (typeof enc.url === "string" && enc.url) {
        return enc.url;
      }
    }

    const mediaContent = item["media:content"];
    if (mediaContent && typeof mediaContent === "object" && mediaContent !== null) {
      const mc = mediaContent as Record<string, unknown>;
      if (typeof mc.url === "string" && mc.url) {
        return mc.url;
      }
    }

    const mediaThumbnail = item["media:thumbnail"];
    if (mediaThumbnail && typeof mediaThumbnail === "object" && mediaThumbnail !== null) {
      const mt = mediaThumbnail as Record<string, unknown>;
      if (typeof mt.url === "string" && mt.url) {
        return mt.url;
      }
    }

    const contentFields = ["content:encodedSnippet", "content:encoded", "content", "contentSnippet"];

    for (const field of contentFields) {
      const content = item[field];
      if (typeof content === "string" && content) {
        const $ = cheerio.load(content);
        const firstImg = $("img").first().attr("src");
        if (firstImg) {
          return firstImg;
        }
      }
    }

    return FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}
