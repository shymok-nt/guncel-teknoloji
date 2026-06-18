import Parser from "rss-parser";
import { connectDB } from "@/lib/db";
import { News, Category } from "@/lib/models";
import { slugifyTr } from "@/lib/slugify";
import { getDefaultImage } from "@/lib/default-images";
import { RSS_SOURCES } from "./rss-sources";
import {
  extractSummary,
  extractKeywords,
  extractImage,
  guessCategory,
} from "./extractors";
import { scrapeArticle } from "./scraper";
import { rewriteWithGroq } from "./groq-rewriter";
import { stripAuthorBoilerplate } from "@/lib/strip-author";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; GuncelTeknolojiBot/1.0; +https://www.guncelteknoloji.com)",
  },
});

interface FetchResult {
  source: string;
  total: number;
  added: number;
  skipped: number;
  errors: number;
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 2;
  while (await News.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

async function ensureCategory(slug: string) {
  let category = await Category.findOne({ slug });
  if (!category) {
    const name = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    category = await Category.create({
      name,
      slug,
      description: `${name} kategorisindeki en güncel haberler.`,
    });
  }
  return category;
}

export async function fetchNews(maxPerSource = 0): Promise<{
  success: boolean;
  results: FetchResult[];
}> {
  const results: FetchResult[] = [];

  try {
    await connectDB();
  } catch (error) {
    console.error("Veritabanı bağlantısı başarısız:", error);
    return { success: false, results: [] };
  }

  const SHORT_CONTENT_THRESHOLD = 500;

  for (const source of RSS_SOURCES) {
    const result: FetchResult = {
      source: source.name,
      total: 0,
      added: 0,
      skipped: 0,
      errors: 0,
    };

    try {
      console.log(`[${source.name}] RSS besmesi taranıyor: ${source.url}`);
      const feed = await parser.parseURL(source.url);
      result.total = feed.items.length;

      let itemCount = 0;
      for (const item of feed.items) {
        if (maxPerSource > 0 && itemCount >= maxPerSource) break;
        try {
          if (!item.title) {
            result.skipped++;
            itemCount++;
            continue;
          }

          const rawSlug = slugifyTr(item.title);
          if (!rawSlug) {
            result.skipped++;
            itemCount++;
            continue;
          }

          const articleUrl = item.link || (item.guid as string) || "";

          let content =
            item["content:encoded"] ||
            item.content ||
            item.contentSnippet ||
            item.title;

          let mainImage = extractImage(item as Record<string, unknown>);

          if (articleUrl) {
            console.log(`  ~ Kazınıyor: ${articleUrl.slice(0, 80)}`);
            const scraped = await scrapeArticle(articleUrl);
            if (scraped.content && scraped.content.length > content.length) {
              content = scraped.content;
            }
            if (scraped.image) {
              mainImage = scraped.image;
            }
          }

          if (content.length < 500) {
            console.warn(`  ! Uyari: kaynak metin çok kisa (${content.length} karakter): ${item.title.slice(0, 50)}`);
          }

          content = stripAuthorBoilerplate(content);

          console.log(`  ~ Groq'a gonderiliyor: ${content.length} karakter kaynak metin`);
          console.log(`  ~ Groq 8sn bekleniyor...`);
          await new Promise((r) => setTimeout(r, 8000));

          const aiResult = await rewriteWithGroq(item.title, content);

          if (!aiResult.success) {
            console.log(`  ✗ Groq basarisiz -> atlaniyor: ${item.title.slice(0, 60)}`);
            result.skipped++;
            itemCount++;
            continue;
          }

          const finalTitle = aiResult.title;
          const rawContent = aiResult.content;
          const finalContent = stripAuthorBoilerplate(stripAuthorBoilerplate(rawContent));
          const finalSlug = await ensureUniqueSlug(slugifyTr(finalTitle) || rawSlug);

          const existing = articleUrl
            ? await News.findOne({ sourceUrl: articleUrl })
            : null;

          if (existing) {
            const existingLen = (existing.content || "").length;
            if (existingLen < SHORT_CONTENT_THRESHOLD) {
              const summary = extractSummary(finalContent);
              const seoKeywords = extractKeywords(`${finalTitle} ${finalContent}`);
              const categorySlug = guessCategory(`${finalTitle} ${finalContent}`);
              const category = await ensureCategory(categorySlug);
              const image = mainImage || getDefaultImage(categorySlug, itemCount);

              await News.updateOne(
                { _id: existing._id },
                {
                  $set: {
                    title: finalTitle,
                    slug: finalSlug,
                    content: finalContent,
                    summary,
                    mainImage: image,
                    category: category._id,
                    seoKeywords,
                    author: "Güncel Teknoloji Editörü",
                    ...(articleUrl ? { sourceUrl: articleUrl } : {}),
                  },
                }
              );
              result.added++;
              console.log(
                `  ✓ Türkçe haber güncellendi: "${finalTitle.slice(0, 50)}..." (${finalContent.length} karakter)`
              );
            } else {
              result.skipped++;
            }
          } else {
            const summary = extractSummary(finalContent);
            const seoKeywords = extractKeywords(`${finalTitle} ${finalContent}`);

            const categorySlug = guessCategory(`${finalTitle} ${finalContent}`);
            const category = await ensureCategory(categorySlug);
            const image = mainImage || getDefaultImage(categorySlug, itemCount);

            const pubDate = item.pubDate
              ? new Date(item.pubDate)
              : item.isoDate
                ? new Date(item.isoDate)
                : new Date();

            await News.create({
              title: finalTitle,
              slug: finalSlug,
              content: finalContent,
              summary,
              mainImage: image,
              category: category._id,
              author: "Güncel Teknoloji Editörü",
              ...(articleUrl ? { sourceUrl: articleUrl } : {}),
              views: 0,
              isPublished: true,
              seoKeywords,
              publishedAt: pubDate,
            });
            result.added++;
            console.log(
              `  ✓ Türkçe haber kaydedildi: "${finalTitle.slice(0, 50)}..." | yazar: Güncel Teknoloji Editörü | ${finalContent.length} karakter`
            );
          }
          itemCount++;
          } catch (itemError) {
            console.error(
              `  ✗ Haber işlenirken hata: ${item.title?.slice(0, 60) || "bilinmeyen"}`,
              itemError
            );
            result.errors++;
            itemCount++;
          }
        }

      console.log(
        `[${source.name}] Tamamlandı: ${result.added} eklendi, ${result.skipped} atlandı, ${result.errors} hata`
      );
    } catch (sourceError) {
      console.error(`[${source.name}] RSS kaynağı işlenirken hata:`, sourceError);
      result.errors = result.total || 1;
    }

    results.push(result);
  }

  return { success: true, results };
}

async function main() {
  console.log("=== Güncel Teknoloji - Haber Çekme Botu ===");
  console.log(`Başlangıç: ${new Date().toLocaleString("tr-TR")}\n`);

  const testFlag = process.argv.includes("--test");
  const maxIndex = process.argv.indexOf("--max");
  const maxItems = maxIndex !== -1 ? parseInt(process.argv[maxIndex + 1], 10) : testFlag ? 3 : 10;
  if (maxItems) {
    console.log(`Limit: kaynak basina en fazla ${maxItems} haber islenecek`);
  }

  const result = await fetchNews(maxItems);

  console.log("\n=== ÖZET ===");
  const totalAdded = result.results.reduce((s, r) => s + r.added, 0);
  const totalSkipped = result.results.reduce((s, r) => s + r.skipped, 0);
  const totalErrors = result.results.reduce((s, r) => s + r.errors, 0);

  for (const r of result.results) {
    console.log(`  ${r.source}: ${r.added} eklendi, ${r.skipped} atlandı, ${r.errors} hata`);
  }

  console.log(`\nToplam: ${totalAdded} haber eklendi, ${totalSkipped} atlandı, ${totalErrors} hata`);
  console.log(`Bitiş: ${new Date().toLocaleString("tr-TR")}`);

  process.exit(0);
}

if (require.main === module || process.argv[1]?.endsWith("fetch-news.ts")) {
  main().catch((error) => {
    console.error("Bot hatası:", error);
    process.exit(1);
  });
}
