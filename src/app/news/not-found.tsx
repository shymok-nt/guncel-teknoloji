import Link from "next/link";

export default function NewsNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-7xl font-bold text-zinc-300 dark:text-zinc-700">
        404
      </div>
      <h1 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Haber Bulunamadı
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        Aradığınız haber sayfası mevcut değil veya kaldırılmış olabilir.
        Lütfen bağlantıyı kontrol edin veya ana sayfaya dönün.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
