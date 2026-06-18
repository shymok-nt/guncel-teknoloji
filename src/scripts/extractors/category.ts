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
    slug: "donanim",
    keywords: [
      "donanım", "işlemci", "cpu", "gpu", "ekran kartı",
      "ram", "bellek", "ssd", "hard disk", "anakart",
      "klavye", "fare", "monitör", "kasa", "soğutma",
      "intel", "amd", "nvidia", "ryzen", "core", "rtx",
      "m2", "nvme", "pcie", "usb", "thunderbolt",
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
    ],
  },
  {
    slug: "mobil",
    keywords: [
      "mobil", "telefon", "iphone", "ios", "android",
      "samsung", "xiaomi", "huawei", "akıllı telefon",
      "tablet", "katlanabilir", "5g", "6g", "ekran",
      "batarya", "şarj", "kamera", "sensör", "parmak izi",
      "yüz tanıma", "oled", "amoled", "lcd",
    ],
  },
  {
    slug: "oyun",
    keywords: [
      "oyun", "game", "gaming", "playstation", "xbox",
      "nintendo", "steam", "epic games", "pc oyun",
      "konsol", "vr", "sanal gerçeklik", "e-spor",
      "oyun motoru", "unity", "unreal", "oyuncu",
    ],
  },
  {
    slug: "guvenlik",
    keywords: [
      "güvenlik", "security", "siber", "hack", "hacker",
      "virüs", "malware", "ransomware", "şifre", "password",
      "kimlik avı", "phishing", "gizlilik", "privacy",
      "vpn", "firewall", "güvenlik duvarı", "açık", "zafiyet",
      "exploit", "zero day", "sıfırıncı gün", "ddos",
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

    return "teknoloji";
  } catch {
    return "teknoloji";
  }
}

export const CATEGORY_SLUGS = CATEGORY_RULES.map((r) => r.slug);
