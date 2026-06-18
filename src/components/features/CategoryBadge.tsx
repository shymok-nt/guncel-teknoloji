const CATEGORY_COLORS: Record<string, string> = {
  "yapay-zeka":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  donanim:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  mobil: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  yazilim:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  bilim: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  oyun: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  guvenlik:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const DEFAULT_COLOR =
  "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

interface CategoryBadgeProps {
  slug: string;
  name: string;
}

export default function CategoryBadge({ slug, name }: CategoryBadgeProps) {
  const colorClass = CATEGORY_COLORS[slug] ?? DEFAULT_COLOR;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {name}
    </span>
  );
}
