import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { News } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], query: q || "" });
  }

  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ results: [], error: "DB connection failed" }, { status: 503 });
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = escaped;

    const docs = await News.find({
      isPublished: true,
      $or: [
        { title: { $regex: pattern, $options: "i" } },
        { summary: { $regex: pattern, $options: "i" } },
        { content: { $regex: pattern, $options: "i" } },
      ],
    })
      .sort({ publishedAt: -1 })
      .populate("category")
      .limit(20)
      .lean();

    const results = docs.map((doc) => {
      const rest = Object.fromEntries(
        Object.entries(doc as unknown as Record<string, unknown>).filter(
          ([k]) => k !== "__v" && k !== "content"
        )
      );
      return rest;
    });

    return NextResponse.json({ results, query: q, total: results.length });
  } catch (error) {
    console.error("Arama hatasi:", error);
    return NextResponse.json({ results: [], query: q, error: String(error) }, { status: 500 });
  }
}
