import Link from "next/link";
import Image from "next/image";
import type { PopulatedNews } from "@/types/news";
import { okumaSuresi } from "@/lib/reading-time";
import CategoryBadge from "./CategoryBadge";

interface HeroSectionProps {
  mainNews: PopulatedNews;
  sideNews: PopulatedNews[];
}

function HeroMain({ news }: { news: PopulatedNews }) {
  const publishedDate = new Date(
    news.publishedAt ?? news.createdAt
  ).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/news/${news.slug}`}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl sm:aspect-[3/2] lg:aspect-[16/10]"
    >
      <Image
        src={news.mainImage}
        alt={news.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 66vw"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 flex flex-col gap-2 p-4 sm:p-6">
        <CategoryBadge
          slug={news.category.slug}
          name={news.category.name}
        />
        <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
          {news.title}
        </h2>
        <p className="line-clamp-2 text-sm text-zinc-300">
          {news.summary}
        </p>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <time dateTime={news.publishedAt?.toISOString() ?? news.createdAt.toISOString()}>
            {publishedDate}
          </time>
          <span>{okumaSuresi(news.content)} dk okuma</span>
        </div>
      </div>
    </Link>
  );
}

function HeroSide({ news }: { news: PopulatedNews }) {
  const publishedDate = new Date(
    news.publishedAt ?? news.createdAt
  ).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/news/${news.slug}`}
      className="group flex gap-3 overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
        <Image
          src={news.mainImage}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="128px"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1">
        <CategoryBadge
          slug={news.category.slug}
          name={news.category.name}
        />
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
          {news.title}
        </h3>
        <time className="text-xs text-zinc-500 dark:text-zinc-500" dateTime={news.publishedAt?.toISOString() ?? news.createdAt.toISOString()}>
          {publishedDate}
        </time>
      </div>
    </Link>
  );
}

export default function HeroSection({ mainNews, sideNews }: HeroSectionProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <HeroMain news={mainNews} />
      </div>
      <div className="flex flex-col gap-4">
        {sideNews.map((news) => (
          <HeroSide key={news._id?.toString() ?? news.slug} news={news} />
        ))}
      </div>
    </section>
  );
}
