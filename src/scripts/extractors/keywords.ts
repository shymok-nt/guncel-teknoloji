const TURKISH_STOP_WORDS = new Set([
  "bir", "ve", "ile", "bu", "da", "de", "en", "çok", "için",
  "olan", "olarak", "daha", "veya", "ama", "ancak", "kadar",
  "sonra", "önce", "gibi", "üzere", "Şu", "bu", "o", "ben",
  "sen", "biz", "siz", "onlar", "kendi", "her", "hiç", "tüm",
  "bazı", "kimi", "hangi", "ne", "nasıl", "neden", "niçin",
  "ve", "ile", "üzere", "karşı", "göre", "doğru", "sonra",
  "önce", "beri", "kadar", "başka", "diğer", "yani", "çünkü",
  "eğer", "yoksa", "oysa", "madem", "halde", "takdirde",
  "hem", "de", "da", "ise", "mi", "mu", "mü", "değil", "ya",
  "yapılan", "yaptı", "etti", "edilen", "oldu", "olduğu",
  "geliyor", "geldi", "gelen", "yeni", "haber", "haberi",
]);

interface WordEntry {
  word: string;
  count: number;
}

export function extractKeywords(text: string, maxKeywords = 8): string[] {
  try {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9a-zçğıöşü ]/gi, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !TURKISH_STOP_WORDS.has(w));

    const frequency = new Map<string, number>();

    for (const word of words) {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    }

    const sorted: WordEntry[] = Array.from(frequency.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);

    return sorted.slice(0, maxKeywords).map((e) => e.word);
  } catch {
    return [];
  }
}
