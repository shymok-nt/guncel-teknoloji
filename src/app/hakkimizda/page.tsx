import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | Güncel Tekno",
  description:
    "Güncel Tekno, yapay zeka destekli otonom haber platformu olarak teknoloji dünyasındaki en son gelişmeleri tarafsız, hızlı ve güvenilir şekilde okuyucuya sunar.",
  openGraph: {
    title: "Hakkımızda | Güncel Tekno",
    description:
      "Yapay zeka destekli, otonom teknoloji haber platformu.",
    url: "https://www.guncelteknoloji.com/hakkimizda",
    siteName: "Güncel Tekno",
    locale: "tr_TR",
    type: "website",
  },
};

const FEATURES = [
  {
    title: "Yapay Zeka Destekli İçerik",
    desc: "Groq altyapısıyla çalışan yapay zeka motorumuz, İngilizce kaynakları anında analiz eder ve özgün Türkçe haberlere dönüştürür.",
  },
  {
    title: "Otonom Haber Takibi",
    desc: "Dünyanın önde gelen teknoloji yayınlarındaki gelişmeleri 7/24 otomatik olarak tarar, filtreler ve kategorize ederiz.",
  },
  {
    title: "Tarafsız ve Güvenilir",
    desc: "İçeriklerimiz yapay zeka tarafından üretilir, hiçbir kurum veya kişinin etkisi altında değildir.",
  },
  {
    title: "SEO Odaklı Yayıncılık",
    desc: "Her haber SEO kurallarına uygun şekilde yapılandırılır, OpenGraph ve JSON-LD ile zenginleştirilir.",
  },
  {
    title: "Hızlı ve Güncel",
    desc: "Kaynaklardaki değişiklikler dakikalar içinde tespit edilir, yeni haberler otomatik olarak yayına alınır.",
  },
  {
    title: "Kapsamlı Kategori Yapısı",
    desc: "Yazılım, yapay zeka, oyun ve bilim olmak üzere 4 ana kategoride binlerce haber.",
  },
];

export default function HakkimizdaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Hakkımızda
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Geleceğin dijital gazeteciliğini bugünden inşa ediyoruz.
        </p>
      </section>

      <section className="mb-16">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Vizyonumuz
          </h2>
          <p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Güncel Tekno</span>,
            yapay zeka teknolojilerini haber üretim sürecine entegre ederek teknoloji
            gazeteciliğinde yeni bir dönem başlatıyor. Geleneksel medyanın aksine, içerik
            üretimini tamamen otonom bir yapay zeka altyapısına emanet ediyoruz.
          </p>
          <p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
            Misyonumuz, İngilizce yayınlanan teknoloji haberlerini en kısa sürede Türkçeye
            kazandırmak, okuyucularımıza küresel gelişmeleri yerel bir perspektiften
            sunmaktır. Groq AI motoru sayesinde her haber, kaynak dildeki anlamını ve
            teknik doğruluğunu koruyarak özgün bir Türkçe makaleye dönüşür.
          </p>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
            Güncel Tekno olarak, yapay zekanın gazetecilikteki potansiyeline inanıyor
            ve bu alanda Türkiye&rsquo;nin en kapsamlı otonom haber platformu olma
            hedefiyle çalışıyoruz.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Neden Güncel Tekno?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
