import { NextRequest, NextResponse } from "next/server";

interface Theme {
  bg1: string;
  bg2: string;
  accent: string;
  icon: string;
  iconColor: string;
}

const THEMES: Record<number, Theme> = {
  0: { bg1: "#1e3a5f", bg2: "#0f172a", accent: "#3b82f6", icon: "M580 260 L580 300 L620 280 Z", iconColor: "#ffffff" },
  1: { bg1: "#3b0764", bg2: "#1e002e", accent: "#a855f7", icon: "M570 260 Q600 230 630 260 Q600 290 570 260", iconColor: "#d8b4fe" },
  2: { bg1: "#1e3a8a", bg2: "#0c1f5e", accent: "#3b82f6", icon: "M570 260 L600 240 L630 260 L630 300 L570 300 Z", iconColor: "#93c5fd" },
  3: { bg1: "#14532d", bg2: "#052014", accent: "#22c55e", icon: "M580 250 Q610 250 610 270 L590 280 L610 280 L610 300 L580 300 Z", iconColor: "#86efac" },
  4: { bg1: "#7c2d12", bg2: "#3b1206", accent: "#f97316", icon: "M580 250 L590 250 L590 300 L580 300 Z M600 260 L610 260 L610 300 L600 300 Z", iconColor: "#fdba74" },
  5: { bg1: "#164e63", bg2: "#082f3e", accent: "#06b6d4", icon: "M600 240 A30 30 0 1 1 570 270 L600 270 Z", iconColor: "#67e8f9" },
  6: { bg1: "#881337", bg2: "#4c0519", accent: "#e11d48", icon: "M580 250 L590 240 L610 240 L620 250 L620 280 L610 290 L590 290 L580 280 Z", iconColor: "#fda4af" },
  7: { bg1: "#450a0a", bg2: "#1f0303", accent: "#ef4444", icon: "M590 240 L610 240 L615 260 L600 290 L585 260 Z", iconColor: "#fca5a5" },
};

const LABELS: Record<number, string> = {
  0: "Teknoloji Haberleri",
  1: "Yapay Zeka",
  2: "Donanim",
  3: "Mobil",
  4: "Yazilim",
  5: "Bilim",
  6: "Oyun",
  7: "Guvenlik",
};

export async function GET(request: NextRequest) {
  const catParam = request.nextUrl.searchParams.get("cat");
  const variant = request.nextUrl.searchParams.get("v") ?? "1";

  const seed = catParam ? parseInt(catParam, 10) : 0;
  const theme = THEMES[seed] ?? THEMES[0];
  const label = LABELS[seed] ?? LABELS[0];

  const patterns: Record<string, string> = {
    "1": `<circle cx="200" cy="150" r="4" fill="${theme.accent}" opacity="0.15"/><circle cx="950" cy="480" r="6" fill="${theme.accent}" opacity="0.12"/><circle cx="400" cy="500" r="3" fill="${theme.accent}" opacity="0.2"/><circle cx="800" cy="100" r="5" fill="${theme.accent}" opacity="0.1"/>`,
    "2": `<rect x="100" y="80" width="8" height="8" rx="1" fill="${theme.accent}" opacity="0.12"/><rect x="1000" y="400" width="12" height="12" rx="2" fill="${theme.accent}" opacity="0.1"/><rect x="350" y="550" width="6" height="6" rx="1" fill="${theme.accent}" opacity="0.15"/><rect x="750" y="50" width="10" height="10" rx="2" fill="${theme.accent}" opacity="0.08"/>`,
    "3": `<line x1="150" y1="120" x2="170" y2="140" stroke="${theme.accent}" stroke-width="1" opacity="0.12"/><line x1="1050" y1="450" x2="1020" y2="480" stroke="${theme.accent}" stroke-width="2" opacity="0.1"/><line x1="300" y1="520" x2="330" y2="500" stroke="${theme.accent}" stroke-width="1.5" opacity="0.15"/><line x1="850" y1="80" x2="820" y2="110" stroke="${theme.accent}" stroke-width="1" opacity="0.08"/>`,
  };

  const pattern = patterns[variant] ?? patterns["1"];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.bg1}"/>
      <stop offset="100%" style="stop-color:${theme.bg2}"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.accent};stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:${theme.accent};stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="600" cy="290" r="120" fill="url(#glow)"/>
  <circle cx="600" cy="290" r="70" fill="${theme.accent}" opacity="0.08"/>
  ${pattern}
  <g transform="translate(600,290)" opacity="0.9">
    <path d="${theme.icon}" fill="${theme.iconColor}" opacity="0.9" transform="translate(-600,-290)"/>
  </g>
  <text x="600" y="420" font-family="system-ui, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle" opacity="0.95">Guncel Teknoloji</text>
  <text x="600" y="450" font-family="system-ui, sans-serif" font-size="15" fill="${theme.accent}" text-anchor="middle" opacity="0.8">${label}</text>
  <rect x="450" y="475" width="300" height="3" rx="1.5" fill="${theme.accent}" opacity="0.4"/>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
