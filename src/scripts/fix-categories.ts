import { connectDB } from "@/lib/db";
import { News, Category } from "@/lib/models";

const FIXES: { titlePattern: string; targetCategory: string }[] = [
  { titlePattern: "buhar", targetCategory: "oyun" },
  { titlePattern: "telegram", targetCategory: "bilim" },
  { titlePattern: "dotmo", targetCategory: "yapay-zeka" },
];

async function fixCategories() {
  console.log("=== Kategori Düzeltme ===\n");

  try {
    await connectDB();
  } catch (error) {
    console.error("Veritabani baglantisi basarisiz:", error);
    process.exit(1);
  }

  let fixedCount = 0;

  for (const fix of FIXES) {
    const category = await Category.findOne({ slug: fix.targetCategory });
    if (!category) {
      await Category.create({
        name: fix.targetCategory.charAt(0).toUpperCase() + fix.targetCategory.slice(1).replace("-", " "),
        slug: fix.targetCategory,
        description: `${fix.targetCategory} kategorisindeki en güncel haberler.`,
      });
      console.log(`  ✓ Kategori olusturuldu: ${fix.targetCategory}`);
    }

    const cat = await Category.findOne({ slug: fix.targetCategory });
    if (!cat) {
      console.error(`  ✗ Kategori bulunamadi: ${fix.targetCategory}`);
      continue;
    }

    const result = await News.updateMany(
      { title: { $regex: fix.titlePattern, $options: "i" } },
      { $set: { category: cat._id } }
    );

    if (result.modifiedCount > 0) {
      console.log(`  ✓ "${fix.titlePattern}" -> ${fix.targetCategory}: ${result.modifiedCount} haber guncellendi`);
      fixedCount += result.modifiedCount;
    } else {
      const existing = await News.findOne({ title: { $regex: fix.titlePattern, $options: "i" } });
      if (existing) {
        console.log(`  ! "${fix.titlePattern}" eslesen haber bulundu ancak zaten dogru kategoride`);
      } else {
        console.log(`  ! "${fix.titlePattern}" eslesen haber bulunamadi`);
      }
    }
  }

  console.log(`\nToplam: ${fixedCount} haber duzeltildi`);
  process.exit(0);
}

fixCategories().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
