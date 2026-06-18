import Link from "next/link";
import Image from "next/image";
import type { PopulatedNews } from "@/types/news";
import { okumaSuresi } from "@/lib/reading-time";
import CategoryBadge from "./CategoryBadge";

interface NewsCardProps {
  news: PopulatedNews;
}

export default function NewsCard({ news }: NewsCardProps) {
  const readingTime = okumaSuresi(news.content);

  const publishedDate = new Date(
    news.publishedAt ?? news.createdAt
  ).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/news/${news.slug}`} className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={news.mainImage}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <CategoryBadge
          slug={news.category.slug}
          name={news.category.name}
        />

        <Link href={`/news/${news.slug}`}>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
            {news.title}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {news.summary}
        </p>

        <div className="mt-auto flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500">
          <time dateTime={news.publishedAt?.toISOString() ?? news.createdAt.toISOString()}>
            {publishedDate}
          </time>
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {readingTime} dk okuma
          </span>
        </div>
      </div>
    </article>
  );
}
