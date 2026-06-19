import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Güncel Tekno",
  description: "Güncel Tekno gizlilik politikası, çerez kullanımı ve kişisel verilerin korunması hakkında bilgiler.",
  openGraph: {
    title: "Gizlilik Politikası | Güncel Tekno",
    description: "Kişisel verilerin korunması ve çerez politikası.",
    url: "https://www.guncelteknoloji.com/gizlilik-politikasi",
    siteName: "Güncel Tekno",
    locale: "tr_TR",
    type: "website",
  },
};

export default function GizlilikPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Gizlilik Politikası
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
          Son güncelleme: 19 Haziran 2026
        </p>
      </section>

      <section className="prose prose-zinc max-w-none dark:prose-invert">
        <h2>1. Giriş</h2>
        <p>
          Güncel Tekno (&quot;biz&quot;, &quot;bizim&quot;, &quot;platform&quot;) olarak
          kullanıcılarımızın gizliliğine önem veriyoruz. Bu gizlilik politikası,
          platformumuzu ziyaret ettiğinizde hangi bilgilerin toplandığını, bu
          bilgilerin nasıl kullanıldığını ve korunduğunu açıklamaktadır.
        </p>

        <h2>2. Toplanan Bilgiler</h2>
        <p>Aşağıdaki türde bilgiler toplanabilir:</p>
        <ul>
          <li>
            <strong>Otomatik olarak toplanan bilgiler:</strong> IP adresi, tarayıcı
            türü, işletim sistemi, ziyaret edilen sayfalar, ziyaret tarihi ve
            saati gibi standart web sunucusu günlük verileri.
          </li>
          <li>
            <strong>Çerezler (Cookies):</strong> Site deneyimini iyileştirmek,
            tercihlerinizi hatırlamak ve site trafiğini analiz etmek için çerezler
            kullanılmaktadır. Çerezleri tarayıcı ayarlarınızdan kontrol edebilirsiniz.
          </li>
          <li>
            <strong>İletişim formu verileri:</strong> İletişim formu aracılığıyla
            gönderdiğiniz ad, e-posta adresi ve mesaj bilgileri yalnızca size
            yanıt vermek amacıyla kullanılır ve üçüncü taraflarla paylaşılmaz.
          </li>
        </ul>

        <h2>3. Bilgilerin Kullanımı</h2>
        <p>Toplanan bilgiler şu amaçlarla kullanılabilir:</p>
        <ul>
          <li>Platformumuzu iyileştirmek ve kullanıcı deneyimini optimize etmek</li>
          <li>Trafik analizi ve içerik performansı ölçümü</li>
          <li>Kullanıcı sorularına ve taleplerine yanıt vermek</li>
          <li>Yasal yükümlülüklere uyum sağlamak</li>
        </ul>

        <h2>4. Çerez Politikası</h2>
        <p>
          Platformumuzda aşağıdaki çerez türleri kullanılmaktadır:
        </p>
        <ul>
          <li>
            <strong>Zorunlu çerezler:</strong> Siteyi düzgün çalışması için
            gerekli olan teknik çerezler.
          </li>
          <li>
            <strong>Tercih çerezleri:</strong> Koyu/açık tema tercihinizi
            hatırlamak için kullanılan yerel depolama (localStorage) verileri.
          </li>
          <li>
            <strong>Analitik çerezler:</strong> Kullanım istatistiklerini
            anonim olarak toplayan çerezler.
          </li>
        </ul>

        <h2>5. Üçüncü Taraflarla Paylaşım</h2>
        <p>
          Kişisel verileriniz, yasal bir zorunluluk olmadıkça veya açık
          rızanız alınmadıkça üçüncü taraflarla paylaşılmaz. Platformumuz
          aşağıdaki üçüncü taraf hizmetleri kullanmaktadır:
        </p>
        <ul>
          <li>Vercel (barındırma ve dağıtım)</li>
          <li>MongoDB Atlas (veritabanı)</li>
          <li>Groq (yapay zeka işlemleri)</li>
        </ul>
        <p>
          Bu hizmet sağlayıcıların her biri kendi gizlilik politikalarına
          tabidir.
        </p>

        <h2>6. Veri Güvenliği</h2>
        <p>
          Verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik
          önlemleri uygulanmaktadır. Ancak internet üzerinden hiçbir veri
          iletiminin tamamen güvenli olmadığını unutmayın.
        </p>

        <h2>7. Kullanıcı Hakları</h2>
        <p>
          Kullanıcılarımız aşağıdaki haklara sahiptir:
        </p>
        <ul>
          <li>Kişisel verilerinize erişim talep etme</li>
          <li>Yanlış veya eksik verilerin düzeltilmesini talep etme</li>
          <li>Verilerinizin silinmesini talep etme</li>
          <li>Veri işleme faaliyetlerine itiraz etme</li>
        </ul>
        <p>
          Bu haklarınızı kullanmak için{" "}
          <a
            href="mailto:iletisim@gunceltekno.online"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            iletisim@gunceltekno.online
          </a>{" "}
          adresinden bize ulaşabilirsiniz.
        </p>

        <h2>8. Politika Değişiklikleri</h2>
        <p>
          Bu gizlilik politikası zaman zaman güncellenebilir. Önemli
          değişikliklerde kullanıcılarımıza bildirim yapılır.
        </p>

        <h2>9. İletişim</h2>
        <p>
          Gizlilik politikamız hakkında sorularınız varsa bizimle iletişime
          geçebilirsiniz:
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
