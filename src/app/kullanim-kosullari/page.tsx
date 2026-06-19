import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Güncel Tekno",
  description: "Güncel Tekno kullanım koşulları, içerik kullanım hakları ve sorumluluk sınırlamaları.",
  openGraph: {
    title: "Kullanım Koşulları | Güncel Tekno",
    description: "Platform kullanım şartları ve yasal uyarılar.",
    url: "https://www.guncelteknoloji.com/kullanim-kosullari",
    siteName: "Güncel Tekno",
    locale: "tr_TR",
    type: "website",
  },
};

export default function KosullarPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Kullanım Koşulları
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
          Son güncelleme: 19 Haziran 2026
        </p>
      </section>

      <section className="prose prose-zinc max-w-none dark:prose-invert">
        <h2>1. Kabul Edilen Koşullar</h2>
        <p>
          Güncel Tekno platformunu (&quot;site&quot;) ziyaret ederek veya
          kullanarak bu kullanım koşullarını kabul etmiş sayılırsınız. Koşulları
          kabul etmiyorsanız siteyi kullanmayı bırakmalısınız.
        </p>

        <h2>2. Hizmet Tanımı</h2>
        <p>
          Güncel Tekno, yapay zeka destekli otonom bir teknoloji haber
          platformudur. Sitede yayınlanan tüm içerikler yapay zeka tarafından
          üretilmekte olup, bilgilendirme amacı taşır.
        </p>

        <h2>3. Fikri Mülkiyet Hakları</h2>
        <p>
          Sitede yayınlanan tüm içeriklerin (haber metinleri, başlıklar,
          görseller, logolar) mülkiyet hakları Güncel Tekno&rsquo;ya aittir.
          İçeriklerin izinsiz kopyalanması, çoğaltılması, dağıtılması veya
          ticari amaçla kullanılması yasaktır.
        </p>
        <p>
          Alıntı yapılması durumunda kaynak gösterilmesi zorunludur. Alıntılar,
          haberin özünü değiştirmeyecek ve yanıltıcı olmayacak şekilde
          yapılmalıdır.
        </p>

        <h2>4. Sorumluluk Reddi</h2>
        <p>
          Platformda yer alan haberler yapay zeka tarafından üretildiğinden,
          içeriklerin doğruluğu, güncelliği veya eksiksizliği konusunda herhangi
          bir garanti verilmemektedir. Kullanıcılar, içerikleri kendi takdir
          yetkileriyle kullanır.
        </p>
        <p>
          Güncel Tekno, sitede yer alan içeriklerden kaynaklanabilecek doğrudan
          veya dolaylı zararlardan sorumlu tutulamaz.
        </p>

        <h2>5. Kullanıcı Davranışı</h2>
        <p>Siteyi kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
        <ul>
          <li>Yasa dışı veya zararlı faaliyetlerde bulunmamak</li>
          <li>Site altyapısına zarar verecek girişimlerde bulunmamak</li>
          <li>Otomatik veri çekme (scraping) araçları kullanmamak</li>
          <li>Başka kullanıcıların deneyimini olumsuz etkileyecek davranışlardan kaçınmak</li>
        </ul>

        <h2>6. Üçüncü Taraf Bağlantıları</h2>
        <p>
          Sitemiz, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu
          sitelerin içerikleri veya gizlilik uygulamaları üzerinde kontrolümüz
          yoktur ve bunlardan sorumlu değiliz.
        </p>

        <h2>7. Hizmet Değişiklikleri</h2>
        <p>
          Güncel Tekno, önceden bildirimde bulunmaksızın site içeriğini,
          hizmetleri veya bu kullanım koşullarını değiştirme hakkını saklı
          tutar. Değişiklikler yayınlandığı anda yürürlüğe girer.
        </p>

        <h2>8. Geçerlilik</h2>
        <p>
          Bu kullanım koşulları Türkiye Cumhuriyeti yasalarına tabidir.
          Koşulların herhangi bir maddesinin geçersiz sayılması, diğer
          maddelerin geçerliliğini etkilemez.
        </p>

        <h2>9. İletişim</h2>
        <p>
          Kullanım koşulları hakkında sorularınız için:
        </p>
        <p>
          E-posta:{" "}
          <a
            href="mailto:iletisim@gunceltekno.online"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            iletisim@gunceltekno.online
          </a>
        </p>
      </section>
    </div>
  );
}
