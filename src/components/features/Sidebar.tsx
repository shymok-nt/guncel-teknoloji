import Link from "next/link";
import Image from "next/image";
import type { PopulatedNews } from "@/types/news";

interface SidebarProps {
  title: string;
  news: PopulatedNews[];
}

function SidebarCard({ news }: { news: PopulatedNews }) {
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
      className="group flex gap-3 border-b border-zinc-100 py-3 last:border-0 dark:border-zinc-800"
    >
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={news.mainImage}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="96px"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-0.5">
        <h4 className="line-clamp-2 text-sm font-medium leading-snug text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
          {news.title}
        </h4>
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          {publishedDate}
        </span>
      </div>
    </Link>
  );
}

export default function Sidebar({ title, news }: SidebarProps) {
  if (news.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {news.map((item) => (
          <SidebarCard
            key={item._id?.toString() ?? item.slug}
            news={item}
          />
        ))}
      </div>
    </aside>
  );
}
