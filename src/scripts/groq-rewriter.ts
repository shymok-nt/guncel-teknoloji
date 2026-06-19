import Groq from "groq-sdk";

const SYSTEM_PROMPT = `Sen profesyonel bir teknoloji editörüsün. Sana verilen Ingilizce haber metnini ve basligini, teknik dogrulugunu koruyarak akici, samimi, SEO uyumlu ve tamamen özgün bir TÜRKÇE makaleye dönüstür. Içerikte yabanci kaynaklara ait hiçbir isim veya telifli ifade birakma.

Yazdigin Türkçe makaleyi asla yarida kesme. Giris, gelisme ve sonuç paragraflari tam olan, son noktasi konulmus, eksiksiz ve bütünsel bir haber metni teslim et.

Haberin kategorisini belirlerken su kurallara KESINLIKLE uy:
- Kullanilabilir kategoriler (slug): yazilim, yapay-zeka, donanim, mobil, oyun, bilim, guvenlik, teknoloji
- ASLA "bilim" secme: Valve, Steam, PlayStation, Xbox, Nintendo, Epic Games, oyun, konsol, islemci (CPU, AMD, Intel), ekran karti (GPU, NVIDIA, RTX), bilgisayar bileseni, overclock, sogutma, kasa, anakart ile ilgili haberlerde
- SADECE su konular "bilim" olarak etiketlenir: uzay, astronomi, fizik, kimya, biyoloji, genetik, NASA, uzay araci, kesif, deney, teorik arastirma, gozlem, teleskop
- Oyun haberleri (konsol, oyun magazasi, oyun lansmani) -> "oyun"
- Donanim haberleri (islemci, ekran karti, bilgisayar bileseni) -> "donanim"
- Mobil cihaz haberleri -> "mobil"
- Yapay zeka haberleri -> "yapay-zeka"
- Yazilim/gelistirici haberleri -> "yazilim"
- Siber guvenlik haberleri -> "guvenlik"
- Yukaridakilerin hicbirine uymuyorsa -> "teknoloji"

Yanitini sadece asagidaki geçerli JSON formatinda ver, baska hiçbir metin ekleme. JSON içinde yeni satir veya sekme gibi kontrol karakterleri KULLANMA:
{
  "title": "Türkçe ve dikkat çekici yeni baslik",
  "content": "tamamen Türkçe yeniden yazilmis, paragraflari <p> etiketiyle ayrilmis HTML haber metni (en az 500 kelime). Metin içinde yeni satir karakteri kullanma, tüm <p> etiketleri tek bir satirda olsun.",
  "category": "uygun-kategori-slogu"
}`;

interface RewriteResult {
  title: string;
  content: string;
  category: string;
  success: boolean;
}

const MAX_RETRIES = 3;
const TURKISH_CHARS = /[ğüşıöçĞÜŞİÖÇ]/;

function isTurkish(text: string): boolean {
  const cleaned = text.replace(/<[^>]*>/g, "").trim();
  if (cleaned.length < 100) return false;
  if (TURKISH_CHARS.test(cleaned)) return true;
  const turkishWords = ["bir", "bu", "ile", "ve", "veya", "için", "daha", "olan", "olarak", "ancak", "çünkü", "gibi", "kadar", "sonra", "önce", "üzerinde", "şekilde", "zaman", "yerine"];
  const words = cleaned.toLowerCase().split(/\s+/);
  const matched = words.filter((w) => turkishWords.includes(w)).length;
  return matched >= 3;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function attemptRewrite(
  groq: Groq,
  originalTitle: string,
  originalContent: string,
  attempt: number
): Promise<{ title: string; content: string; category: string } | null> {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Haber Basligi: ${originalTitle}\n\nHaber Metni:\n${originalContent}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    });

    const text = response.choices[0]?.message?.content?.trim();
    if (!text) {
      console.warn(`  ! Groq bos yanit döndü (deneme ${attempt})`);
      return null;
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn(`  ! JSON yaniti bulunamadi (deneme ${attempt})`);
      return null;
    }

    const rawJson = jsonMatch[0];

    let newTitle = originalTitle;
    let newContent = originalContent;
    let newCategory = "teknoloji";
    let parsed = false;

    try {
      const data = JSON.parse(rawJson);
      newTitle = data.title?.trim() || originalTitle;
      newContent = data.content?.trim() || originalContent;
      newCategory = data.category?.trim() || "teknoloji";
      parsed = true;
    } catch {
      try {
        const titleMatch = rawJson.match(/"title"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (titleMatch) {
          newTitle = titleMatch[1].replace(/\\n/g, " ").replace(/\\"/g, '"').trim() || originalTitle;
        }

        const contentKey = '"content": "';
        const contentKeyIdx = rawJson.indexOf(contentKey);
        if (contentKeyIdx !== -1) {
          const valueStart = contentKeyIdx + contentKey.length;
          const closingBrace = rawJson.lastIndexOf("}");
          if (closingBrace !== -1 && closingBrace > valueStart) {
            const lastQuote = rawJson.lastIndexOf('"', closingBrace);
            if (lastQuote !== -1 && lastQuote > valueStart) {
              const rawContent = rawJson.substring(valueStart, lastQuote);
              newContent = rawContent.replace(/\\n/g, " ").replace(/\\"/g, '"').trim() || originalContent;
            }
          }
        }

        const categoryMatch = rawJson.match(/"category"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (categoryMatch) {
          newCategory = categoryMatch[1].replace(/\\n/g, " ").replace(/\\"/g, '"').trim() || "teknoloji";
        }

        if (titleMatch || contentKeyIdx !== -1) {
          parsed = true;
        }
      } catch {
        return null;
      }
    }

    if (parsed) {
      if (!isTurkish(newContent)) {
        console.warn(`  ! Türkçe dogrulama basarisiz (deneme ${attempt})`);
        return null;
      }
      return { title: newTitle, content: newContent, category: newCategory };
    }

    console.warn(`  ! JSON parse edilemedi (deneme ${attempt})`);
    return null;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("API_KEY") || msg.includes("api_key") || msg.includes("401") || msg.includes("403")) {
      console.error(`  ! Groq kalici hata: ${msg}`);
      throw error;
    }
    console.warn(`  ! Groq deneme ${attempt} basarisiz: ${msg}`);
    return null;
  }
}

export async function rewriteWithGroq(
  originalTitle: string,
  originalContent: string
): Promise<RewriteResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("  ! GROQ_API_KEY bulunamadi, haber atlaniyor");
    return { title: originalTitle, content: originalContent, category: "teknoloji", success: false };
  }

  const groq = new Groq({ apiKey });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 1) {
      const delay = Math.min(2000 * Math.pow(2, attempt - 2), 10000);
      console.log(`  ~ Groq tekrar deneniyor (${attempt}/${MAX_RETRIES}, ${delay}ms bekleniyor)...`);
      await sleep(delay);
    }

    const result = await attemptRewrite(groq, originalTitle, originalContent, attempt);
    if (result) {
      console.log(
        `  ✦ Groq Türkçe yazildi: "${result.title.slice(0, 50)}..." (${result.content.length} karakter)`
      );
      return { title: result.title, content: result.content, category: result.category, success: true };
    }
  }

  console.warn("  ! Tum Groq denemeleri basarisiz, haber atlaniyor");
  return { title: originalTitle, content: originalContent, category: "teknoloji", success: false };
}
