import * as cheerio from "cheerio";

const JUNK_SELECTORS = [
  ".post-comments",
  ".comments-area",
  ".comments-content",
  ".comments-toggle",
  ".comment-respond",
  "#comments",
  "#respond",
  ".commentlist",
  ".social-share",
  ".share-buttons",
  ".related-news",
  ".related-posts",
  ".recommended",
  ".newsletter",
  ".subscribe-form",
  ".author-box",
  ".post-navigation",
  ".yarpp-related",
  ".etiket",
  ".tags",
  ".breadcrumb",
  "script",
  "style",
  "iframe",
  "noscript",
];

export function cleanHtmlContent(html: string): string {
  try {
    const $ = cheerio.load(html);
    $(JUNK_SELECTORS.join(", ")).remove();
    const cleaned = $.html();
    return cleaned;
  } catch {
    return html;
  }
}
