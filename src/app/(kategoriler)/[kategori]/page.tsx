import type { Metadata } from "next";
import type { PopulatedNews } from "@/types/news";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { News, Category } from "@/lib/models";
import NewsCard from "@/components/features/NewsCard";
import AdBanner from "@/components/features/AdBanner";

interface Props {
  params: Promise<{ kategori: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori } = await params;

  const db = await connectDB();
  const cat = db ? await Category.findOne({ slug: kategori }).lean() : null;

  if (!cat) {
    return { title: "Kategori Bulunamadı" };
  }

  return {
    title: `${cat.name} Haberleri`,
    description:
      cat.description ||
      `En güncel ${cat.name.toLowerCase()} haberleri, gelişmeleri ve analizleri.`,
    alternates: {
      canonical: `https://www.guncelteknoloji.com/${kategori}`,
    },
    openGraph: {
      title: `${cat.name} Haberleri | Güncel Tekno`,
      description:
        cat.description ||
        `En güncel ${cat.name.toLowerCase()} haberleri, gelişmeleri ve analizleri.`,
      url: `https://www.guncelteknoloji.com/${kategori}`,
      type: "website",
      locale: "tr_TR",
      siteName: "Güncel Tekno",
    },
  };
}

export default async function KategoriPage({ params }: Props) {
  const { kategori } = await params;

  const db = await connectDB();

  const cat = db ? await Category.findOne({ slug: kategori }).lean() : null;

  if (!cat) {
    notFound();
  }

  const news = cat
    ? await News.find({
        category: cat._id,
        isPublished: true,
      })
        .sort({ publishedAt: -1 })
        .populate("category")
        .lean()
    : [];

  const typedNews = news.map((item) => {
    const rest = Object.fromEntries(
      Object.entries(item).filter(([k]) => k !== "__v")
    );
    return {
      ...rest,
      category: rest.category as unknown as PopulatedNews["category"],
      publishedAt: rest.publishedAt ?? undefined,
    } as unknown as PopulatedNews;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {cat.name} Haberleri
        </h1>
        {cat.description && (
          <p className="mt-2 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {cat.description}
          </p>
        )}
      </section>

      <AdBanner className="mb-10" />

      {typedNews.length > 0 ? (
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {typedNews.map((item) => (
              <NewsCard key={item._id?.toString() ?? item.slug} news={item} />
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">
            Bu kategoride henüz haber bulunmuyor.
          </p>
        </div>
      )}
    </div>
  );
}
