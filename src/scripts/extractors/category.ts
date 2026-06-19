const CATEGORY_RULES: { slug: string; keywords: string[] }[] = [
  {
    slug: "yapay-zeka",
    keywords: [
      "yapay zeka", "yapayzeka", "artificial intelligence", "ai",
      "makine öğrenmesi", "machine learning", "deep learning",
      "derin öğrenme", "chatgpt", "gpt", "openai", "anthropic",
      "claude", "gemini", "llm", "yapay sinir ağı", "nöral ağ",
      "yapayzekâ", "büyük dil modeli",
    ],
  },
  {
    slug: "yazilim",
    keywords: [
      "yazılım", "güncelleme", "sürüm", "kod", "açık kaynak",
      "open source", "github", "git", "api", "framework",
      "javascript", "typescript", "python", "react", "node",
      "docker", "kubernetes", "bulut", "cloud", "veritabanı",
      "database", "uygulama", "app", "yayınlandı", "sürümü",
      "geliştirici", "developer", "debug", "lint",
    ],
  },
  {
    slug: "oyun",
    keywords: [
      "oyun", "game", "gaming", "playstation", "xbox",
      "nintendo", "steam", "epic games", "pc oyun",
      "konsol", "vr", "sanal gerçeklik", "e-spor",
      "oyun motoru", "unity", "unreal", "oyuncu",
      "işlemci", "cpu", "gpu", "ekran kartı",
      "intel", "amd", "nvidia", "ryzen", "core", "rtx",
      "donanım", "ram", "bellek", "anakart",
    ],
  },
  {
    slug: "bilim",
    keywords: [
      "bilim", "uzay", "astronomi", "fizik", "kimya",
      "biyoloji", "genetik", "nasa", "spacex", "tübitak",
      "nobel", "araştırma", "keşif", "deney", "teori",
      "evren", "gezegen", "yıldız", "karadelik", "teleskop",
      "hubble", "jwst", "mars", "ay", "roket",
      "telegram", "vpn", "sosyal medya", "yasak",
    ],
  },
];

export function guessCategory(text: string): string {
  try {
    const lower = text.toLowerCase();

    const scores = CATEGORY_RULES.map((rule) => {
      let score = 0;
      for (const kw of rule.keywords) {
        if (lower.includes(kw)) {
          score++;
        }
      }
      return { slug: rule.slug, score };
    });

    scores.sort((a, b) => b.score - a.score);

    if (scores[0].score > 0) {
      return scores[0].slug;
    }

    return "bilim";
  } catch {
    return "bilim";
  }
}

export const CATEGORY_SLUGS = CATEGORY_RULES.map((r) => r.slug);
