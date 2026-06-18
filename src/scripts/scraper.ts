import axios from "axios";
import * as cheerio from "cheerio";

const SCRAPE_TIMEOUT = 30000;

interface ScrapedData {
  content: string;
  image: string | null;
}

const SITE_SELECTORS: Record<string, string[]> = {
  "techcrunch.com": [
    ".entry-content",
    ".article-content",
    ".wp-block-post-content",
    "article",
    ".post-content",
    ".content",
  ],
  "theverge.com": [
    ".duet--article--article-body-component",
    ".c-entry-content",
    ".article-body",
    ".l-col__main",
    "article",
  ],
  "engadget.com": [
    ".article-content",
    ".post-content",
    "article",
    ".caas-body",
    ".content-body",
  ],
  "androidcentral.com": [
    ".article-content",
    ".content-wrapper",
    ".article-body",
    '[itemprop="articleBody"]',
    ".entry-content",
    "article",
    ".post-content",
  ],
  "macrumors.com": [
    "article",
    ".content",
    ".post-content",
    "#content",
    ".article-body",
    ".entry-content",
  ],
};

const COMMON_SELECTORS = [
  "article",
  '[itemprop="articleBody"]',
  ".content-body",
  ".article-body",
  ".entry-content",
  ".post-content",
  ".article-content",
  ".haber-icerik",
  ".detail-content",
  ".detail-content-body",
  ".news-content",
  ".haber-detay",
  ".content",
  ".detay",
  ".single-content",
  ".content-area",
  "#single-content",
  ".post-detail",
  ".content-detail",
  ".page-content",
  ".article-detail",
  ".news-detail",
  ".icerik",
  ".haber",
  ".makale",
  ".content-body-inner",
  ".post-body",
  "main",
];

function getSelectors(url: string): string[] {
  const urlLower = url.toLowerCase();
  for (const [domain, selectors] of Object.entries(SITE_SELECTORS)) {
    if (urlLower.includes(domain)) {
      return [...selectors, ...COMMON_SELECTORS];
    }
  }
  return COMMON_SELECTORS;
}

function cleanPage($: cheerio.CheerioAPI): void {
  const removeSelectors = [
    "script", "style", "nav", "header", "footer", "aside", "iframe",
    "noscript", "svg", "form", "button", "input",
    ".ad", ".ads", ".reklam", ".advertisement", ".banner",
    ".social-share", ".share-buttons", ".social-buttons",
    ".related-news", ".related-posts", ".recommended", ".recommend",
    ".sidebar", ".widget", ".news-detail-sidebar",
    ".haber-sidebar", ".right-sidebar", ".left-sidebar",
    ".etiket", ".tags", ".tag-list",
    ".breadcrumb", ".breadcrumbs",
    ".author-info", ".author-box", ".yazar",
    ".news-nav", ".post-nav", ".page-nav",
    ".newsletter", ".subscribe", ".email-subscribe",
    ".popup", ".modal", ".overlay",
    "[role='complementary']",
    "[role='navigation']",
    ".menu", ".navigation", ".navbar",
    "[class*=comment]", "[class*=yorum]", "[id*=comment]", "[id*=yorum]",
    "[class*=share]", "[class*=social]",
    "[class*=related]", "[class*=recommended]",
  ];

  $(removeSelectors.join(", ")).remove();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scoreElement($el: any): number {
  const text = $el.text().trim();
  const pCount = $el.find("p").length;
  const textLen = text.length;

  if (textLen < 200) return 0;
  if (pCount === 0) return 0;

  const pText = $el.find("p").text().trim().length;
  const pRatio = textLen > 0 ? pText / textLen : 0;
  return pCount * 10 + textLen * 0.1 + pRatio * 20;
}

function extractContentByHeuristic($: cheerio.CheerioAPI): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bestEl: any = null;
  let bestScore = 0;

  $("div, section, article, main").each((_, el) => {
    const $el = $(el);
    const score = scoreElement($el);
    if (score > bestScore) {
      bestScore = score;
      bestEl = $el;
    }
  });

  if (!bestEl) return "";

  const html = bestEl.html() || "";
  const $clean = cheerio.load(html);
  $clean("script, style, iframe, noscript, .ad, .ads, .reklam").remove();

  const cleaned = $clean.html() || "";
  if (cleaned.trim().length < 200) return "";

  return cleaned;
}

function trySelectors($: cheerio.CheerioAPI, selectors: string[]): string {
  for (const selector of selectors) {
    const el = $(selector);
    if (el.length > 0) {
      const html = el.html();
      if (html && html.trim().length > 200) {
        const $article = cheerio.load(html);
        $article("script, style, iframe, .ad, .ads, .reklam, noscript").remove();
        const clean = $article.html();
        if (clean && clean.trim().length > 200) {
          return clean;
        }
      }
    }
  }
  return "";
}

function extractOgImage($: cheerio.CheerioAPI): string | null {
  const ogImage = $('meta[property="og:image"]').attr("content");
  if (ogImage && !ogImage.includes("data:")) return ogImage;

  const twitterImage = $('meta[name="twitter:image"]').attr("content");
  if (twitterImage && !twitterImage.includes("data:")) return twitterImage;

  const firstImg = $("img").first().attr("src");
  if (firstImg && !firstImg.includes("data:") && !firstImg.includes("1x1")) {
    if (firstImg.startsWith("http") || firstImg.startsWith("//")) {
      return firstImg.startsWith("//") ? `https:${firstImg}` : firstImg;
    }
  }

  return null;
}

export async function scrapeArticle(url: string): Promise<ScrapedData> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await axios.get(url, {
        timeout: SCRAPE_TIMEOUT,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        maxRedirects: 5,
      });

      const $ = cheerio.load(response.data);

      cleanPage($);

      const selectors = getSelectors(url);
      let content = trySelectors($, selectors);

      if (!content) {
        content = extractContentByHeuristic($);
      }

      if (content && content.trim().length >= 200) {
        const image = extractOgImage($);
        return { content, image };
      }

      if (attempt === 1) {
        console.log(`  ~ Kaziyici tekrar deneniyor (${url.slice(0, 60)})...`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    } catch {
      if (attempt === 1) {
        console.log(`  ~ Kaziyici tekrar deneniyor (${url.slice(0, 60)})...`);
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        console.error(`  ✗ Sayfa kazınamadi: ${url}`);
      }
    }
  }
  return { content: "", image: null };
}
