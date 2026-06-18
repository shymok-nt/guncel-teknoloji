import type { PopulatedNews } from "@/types/news";
import { connectDB } from "@/lib/db";
import { News } from "@/lib/models";
import HeroSection from "@/components/features/HeroSection";
import NewsCard from "@/components/features/NewsCard";
import AdBanner from "@/components/features/AdBanner";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const db = await connectDB();

  const news = db
    ? await News.find({ isPublished: true })
        .sort({ publishedAt: -1 })
        .populate("category")
        .limit(15)
        .lean()
    : [];

  const typedNews = news.map((item) => {
    const rest = Object.fromEntries(
      Object.entries(item).filter(([k]) => k !== "__v")
    );
    return {
      ...rest,
      category: rest.category as unknown as PopulatedNews["category"],
      publishedAt: (rest as { publishedAt?: Date }).publishedAt ?? undefined,
    } as unknown as PopulatedNews;
  });

  const [mainNews, ...rest] = typedNews;
  const sideNews = rest.slice(0, 3);
  const feedNews = rest.slice(3);

  const midIndex = Math.floor(feedNews.length / 2);
  const firstHalf = feedNews.slice(0, midIndex);
  const secondHalf = feedNews.slice(midIndex);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <AdBanner className="mb-8" />

      <section className="mb-10">
        <h1 className="sr-only">Güncel Teknoloji Haberleri</h1>
        {mainNews ? (
          <HeroSection mainNews={mainNews} sideNews={sideNews} />
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-500 dark:text-zinc-400">
              Henüz haber bulunmuyor. Botu çalıştırarak haberleri çekebilirsiniz.
            </p>
          </div>
        )}
      </section>

      {feedNews.length > 0 && (
        <>
          <section className="mb-10">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Son Haberler
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {firstHalf.map((item) => (
                <NewsCard key={item._id?.toString() ?? item.slug} news={item} />
              ))}
            </div>
          </section>

          <AdBanner className="mb-10" />

          <section className="mb-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {secondHalf.map((item) => (
                <NewsCard key={item._id?.toString() ?? item.slug} news={item} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
