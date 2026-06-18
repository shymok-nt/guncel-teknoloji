import { NextResponse } from "next/server";
import { fetchNews } from "@/scripts/fetch-news";

export async function GET() {
  try {
    const result = await fetchNews();

    return NextResponse.json(
      {
        success: result.success,
        message: result.success
          ? "Haber çekme işlemi tamamlandı."
          : "Haber çekme işlemi sırasında hata oluştu.",
        timestamp: new Date().toISOString(),
        results: result.results,
        totalAdded: result.results.reduce((s, r) => s + r.added, 0),
        totalSkipped: result.results.reduce((s, r) => s + r.skipped, 0),
        totalErrors: result.results.reduce((s, r) => s + r.errors, 0),
      },
      { status: result.success ? 200 : 500 }
    );
  } catch (error) {
    console.error("Bot API hatası:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Beklenmeyen bir hata oluştu.",
        error: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
