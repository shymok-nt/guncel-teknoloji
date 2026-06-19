import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Künye | Güncel Tekno",
  description: "Güncel Tekno künye bilgileri, kurucu ve iletişim detayları.",
  openGraph: {
    title: "Künye | Güncel Tekno",
    description: "Platform künye bilgileri.",
    url: "https://www.guncelteknoloji.com/k%C3%BCnye",
    siteName: "Güncel Tekno",
    locale: "tr_TR",
    type: "website",
  },
};

const KUNYE_INFO = [
  { label: "Platform Adı", value: "Güncel Tekno" },
  { label: "Kurucu / İmtiyaz Sahibi", value: "Onur" },
  { label: "Altyapı ve Teknoloji", value: "Güncel Tekno AI Engine (Groq + Next.js)" },
  { label: "Merkez", value: "İstanbul, Türkiye" },
  { label: "E-posta", value: "iletisim@gunceltekno.online" },
  { label: "Yayın Türü", value: "Çevrim içi teknoloji haber platformu" },
  { label: "Yayın Dili", value: "Türkçe" },
  { label: "Yapay Zeka Modeli", value: "Llama 3.3 70B (Groq)" },
  { label: "Veritabanı", value: "MongoDB Atlas" },
  { label: "Barındırma", value: "Vercel (Edge Network)" },
];

export default function KnyePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Künye
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Güncel Tekno yayın künyesi.
        </p>
      </section>

      <section>
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full">
            <tbody>
              {KUNYE_INFO.map((item, index) => (
                <tr
                  key={item.label}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-zinc-900"
                      : "bg-zinc-50 dark:bg-zinc-950"
                  }
                >
                  <td className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100 w-56 border-r border-zinc-200 dark:border-zinc-800">
                    {item.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
