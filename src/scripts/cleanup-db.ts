import { connectDB } from "@/lib/db";
import { News, Category } from "@/lib/models";

async function cleanup() {
  console.log("=== Veritabani Temizlik ===");
  console.log(`Baslangic: ${new Date().toLocaleString("tr-TR")}\n`);

  try {
    await connectDB();
  } catch (error) {
    console.error("Veritabani baglantisi basarisiz:", error);
    process.exit(1);
  }

  const newsCount = await News.countDocuments();
  const catCount = await Category.countDocuments();
  console.log(`Mevcut: ${newsCount} haber, ${catCount} kategori`);

  await News.deleteMany({});
  console.log("Butun haberler silindi.");

  await Category.deleteMany({});
  console.log("Butun kategoriler silindi.");

  console.log("\n=== Temizlik tamamlandi ===");
  process.exit(0);
}

cleanup().catch((err) => {
  console.error("Temizlik hatasi:", err);
  process.exit(1);
});
