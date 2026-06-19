import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { News, Category } from "@/lib/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.guncelteknoloji.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kunye`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/kullanim-kosullari`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const db = await connectDB();

  if (!db) {
    return staticPages;
  }

  const [categories, news] = await Promise.all([
    Category.find({}).lean(),
    News.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .select("slug publishedAt updatedAt")
      .lean(),
  ]);

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: item.updatedAt ?? item.publishedAt ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...newsPages];
}
