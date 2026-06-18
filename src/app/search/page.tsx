import type { PopulatedNews } from "@/types/news";
import { connectDB } from "@/lib/db";
import { News } from "@/lib/models";
import HeroSection from "@/components/features/HeroSection";
import NewsCard from "@/components/features/NewsCard";
import AdBanner from "@/components/features/AdBanner";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  if (!q) return { title: "Arama" };
  return {
    title: `"${q}" icin arama sonuclari`,
    description: `${q} ile ilgili haberler.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const trimmed = q?.trim() ?? "";

  let news: PopulatedNews[] = [];

  if (trimmed.length >= 2) {
    const db = await connectDB();
    if (db) {
      const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const docs = await News.find({
        isPublished: true,
        $or: [
          { title: { $regex: escaped, $options: "i" } },
          { summary: { $regex: escaped, $options: "i" } },
        ],
      })
        .sort({ publishedAt: -1 })
        .populate("category")
        .limit(20)
        .lean();

      news = (docs as unknown as PopulatedNews[]).map((item) => {
        const rest = Object.fromEntries(
          Object.entries(item).filter(([k]) => k !== "__v")
        );
        return {
          ...rest,
          category: rest.category as unknown as PopulatedNews["category"],
          publishedAt: (rest as { publishedAt?: Date }).publishedAt ?? undefined,
        } as unknown as PopulatedNews;
      });
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {trimmed ? `"${trimmed}" icin arama sonuclari` : "Arama"}
      </h1>

      {trimmed && trimmed.length < 2 && (
        <p className="text-zinc-500 dark:text-zinc-400">
          En az 2 karakter girmelisiniz.
        </p>
      )}

      {trimmed.length >= 2 && news.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">
            Aradiginiz kriterlere uygun haber bulunamadi.
          </p>
        </div>
      )}

      {news.length > 0 && (
        <>
          {news[0] && (
            <section className="mb-10">
              <HeroSection mainNews={news[0]} sideNews={news.slice(1, 4)} />
            </section>
          )}

          {news.length > 4 && (
            <>
              <AdBanner className="mb-8" />
              <section>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {news.slice(4).map((item) => (
                    <NewsCard key={item._id?.toString() ?? item.slug} news={item} />
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}

      {!trimmed && (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">
            Yukaridaki arama kutusuna bir kelime yazarak haberlerde arama yapabilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}
