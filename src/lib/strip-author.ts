export function stripAuthorBoilerplate(html: string): string {
  if (!html) return html;

  const patterns: RegExp[] = [
    // Yazar: İsim Soyisim (çeşitli formatlar)
    /(?:Yazar|Yayın|Kaynak|Editör|Haber|Yazan)\s*[:\-–•❯>]\s*[^\n<.]{2,50}(?:<\/?[^>]*>)?/gi,
    /(?:Yazar|Yayın|Kaynak|Editör|Haber|Yazan)\s*[:\-–•❯>]\s*[^\n<.]{2,50}(?:\.\s*)/gi,

    // Site adı + Editörü/Yazarı kalıbı
    /-\s*(?:Webtekno|ShiftDelete|Chip\s*Online|CHIP|Teknokulis|DonanımHaber)\s*(?:Editörü|Yazarı)?/gi,
    /(?:Webtekno|ShiftDelete|Chip\s*Online|CHIP|Teknokulis|DonanımHaber)[\s.]*(?:com|net|org|com\.tr)\S*/gi,
    /(?:Webtekno|ShiftDelete|Chip|CHIP)\s*(?:Editörü|Yazarı|Haberleri)/gi,

    // Kategori/breadcrumb HTML'leri (görünmez linkler)
    /class="(?:primary-cat|category|cat|breadcrumb|entry-category)"[^>]*>[^<]*<\/a>/gi,
    /href="https?:\/\/(?:www\.)?(?:webtekno|shiftdelete|chip)\./gi,

    // Emoji temizlik
    /❌\s*[^\n]+\n?/g,
    /✅\s*[^\n]+\n?/g,
    /⚠️\s*[^\n]+\n?/g,
    /🔴\s*[^\n]+\n?/g,
    /🟢\s*[^\n]+\n?/g,
    /👉\s*[^\n]*/g,

    // Reklam/sosyal medya etiketleri
    /\b(?:reklam|Reklam|Sponsor|sponsor|Sponsorlu)\b[^\n<]*/g,

    // Tarih + yazar formatı (örn: "15 Haziran 2026 - Yazar: Ahmet")
    /\d{1,2}\s+\w+\s+\d{4}\s*[–-]\s*(?:Yazar|Editör|Yayın)[:\-]\s*[^\n]{2,40}/gi,

    // HTML yorumları
    /<!--[\s\S]*?-->/g,
  ];

  let result = html;
  for (const pattern of patterns) {
    result = result.replace(pattern, "");
  }

  // HTML etiketleri içindeki site adlarını temizle
  result = result.replace(/<[^>]*(?:webtekno|shiftdelete|chip|chiponline)[^>]*>/gi, "");
  result = result.replace(/<[^>]*class="[^"]*(?:author|byline|writer)[^"]*"[^>]*>[\s\S]{0,200}?<\/[^>]+>/gi, "");

  // Kısa/boş satırları temizle
  result = result
    .split("\n")
    .map((line) => {
      const stripped = line.replace(/<[^>]+>/g, "").trim();
      if (!stripped) return "";
      if (stripped.length < 20 && /^[\s\w,.;:!?\-–/]+$/.test(stripped)) return "";
      return line;
    })
    .filter(Boolean)
    .join("\n");

  return result.trim();
}
