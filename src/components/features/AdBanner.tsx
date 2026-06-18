interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-700 dark:bg-zinc-900/50 ${className}`}
    >
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
          Reklam
        </p>
        <p className="mt-1 text-sm text-zinc-300 dark:text-zinc-600">
          Reklam alanı — Google AdSense
        </p>
      </div>
    </div>
  );
}
