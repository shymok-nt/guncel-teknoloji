import type { Metadata } from "next";
import type { INews } from "@/types/news";
import type { ICategory } from "@/types/category";
import type { Types } from "mongoose";
import type { PopulatedNews } from "@/types/news";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { News } from "@/lib/models";
import { okumaSuresi } from "@/lib/reading-time";
import { cleanHtmlContent } from "@/lib/clean-html";
import Breadcrumbs from "@/components/features/Breadcrumbs";
import CategoryBadge from "@/components/features/CategoryBadge";
import Sidebar from "@/components/features/Sidebar";
import AdBanner from "@/components/features/AdBanner";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let haber: INews | null = null;
  try {
    const db = await connectDB();
    if (db) {
      const doc = await News.findOne({ slug }).populate("category").lean();
      haber = doc as unknown as INews | null;
    }
  } catch {
    // DB hatasinda metadata default doner
  }

  if (!haber) {
    return { title: "Haber Bulunamadı" };
  }

  return {
    title: haber.title,
    description: haber.summary,
    alternates: {
      canonical: `https://www.guncelteknoloji.com/news/${slug}`,
    },
    keywords: haber.seoKeywords,
    openGraph: {
      title: `${haber.title} | Güncel Tekno`,
      description: haber.summary,
      url: `https://www.guncelteknoloji.com/news/${slug}`,
      type: "article",
      locale: "tr_TR",
      siteName: "Güncel Tekno",
      images: haber.mainImage ? [{ url: haber.mainImage }] : [],
      publishedTime: haber.publishedAt?.toISOString(),
      modifiedTime: haber.updatedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${haber.title} | Güncel Tekno`,
      description: haber.summary,
      images: haber.mainImage ? [haber.mainImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  type HaberDoc = INews & { __v?: number; category: ICategory };
  let haber: HaberDoc | null = null;

  try {
    const db = await connectDB();
    if (db) {
      const doc = await News.findOne({ slug })
        .populate<{ category: ICategory }>("category")
        .lean();
      if (doc) {
        const { _id, ...rest } = doc as unknown as HaberDoc;
        haber = { ...rest, _id: _id as unknown as Types.ObjectId };
      }
    }
  } catch (error) {
    console.error("Haber detay sayfasi veritabani hatasi:", error);
  }

  if (!haber) {
    notFound();
  }

  const category = haber.category as unknown as {
    _id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  };

  let relatedNews: PopulatedNews[] = [];
  try {
    const db = await connectDB();
    if (db) {
      const docs = await News.find({
        category: category._id,
        slug: { $ne: slug },
        isPublished: true,
      })
        .sort({ publishedAt: -1 })
        .populate<{ category: ICategory }>("category")
        .limit(5)
        .lean();
      relatedNews = (docs as unknown as PopulatedNews[]).map((item) => {
        const rest = Object.fromEntries(
          Object.entries(item).filter(([k]) => k !== "__v")
        );
        return { ...rest, publishedAt: (rest as { publishedAt?: Date }).publishedAt ?? undefined } as PopulatedNews;
      });
    }
  } catch {
    console.error("Benzer haberler getirilemedi");
  }

  const readingTime = okumaSuresi(haber.content);

  const publishedDate = new Date(
    haber.publishedAt ?? haber.createdAt
  ).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: haber.title,
    description: haber.summary,
    image: haber.mainImage,
    url: `https://www.guncelteknoloji.com/news/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.guncelteknoloji.com/news/${slug}`,
    },
    author: {
      "@type": "Organization",
      name: "Güncel Teknoloji",
    },
    publisher: {
      "@type": "Organization",
      name: "Güncel Teknoloji",
      logo: {
        "@type": "ImageObject",
        url: "https://www.guncelteknoloji.com/logo.png",
      },
    },
    datePublished: haber.publishedAt?.toISOString() ?? haber.createdAt.toISOString(),
    dateModified: haber.updatedAt?.toISOString(),
    inLanguage: "tr",
    keywords: haber.seoKeywords?.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: category.name, href: `/${category.slug}` },
            { label: haber.title },
          ]}
        />

        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          <article className="lg:col-span-2">
            <CategoryBadge slug={category.slug} name={category.name} />

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
              {haber.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <span>Güncel Tekno</span>
              <span>&middot;</span>
              <time dateTime={haber.publishedAt?.toISOString() ?? haber.createdAt.toISOString()}>
                {publishedDate}
              </time>
              <span>&middot;</span>
              <span>{readingTime} dk okuma</span>
              {haber.views > 0 && (
                <>
                  <span>&middot;</span>
                  <span>{haber.views} görüntülenme</span>
                </>
              )}
            </div>

            {haber.mainImage && (
              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl">
                <Image
                  src={haber.mainImage}
                  alt={haber.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  unoptimized
                />
              </div>
            )}

            <div
              className="prose prose-zinc mt-8 max-w-none leading-relaxed dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: cleanHtmlContent(haber.content) }}
            />

            {haber.seoKeywords && haber.seoKeywords.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {haber.seoKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </article>

          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              <Sidebar
                title="Benzer Haberler"
                news={relatedNews}
              />
              <AdBanner />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
