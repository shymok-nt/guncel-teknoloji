import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Güncel Tekno - Güncel Tekno Haberleri",
    template: "%s | Güncel Tekno",
  },
  description:
    "Teknoloji dünyasındaki en son gelişmeler, yapay zeka, yazılım, donanım, bilim ve dijital dönüşüm haberlerini takip edin. Güncel ve güvenilir teknoloji haberciliği.",
  keywords: [
    "teknoloji",
    "haber",
    "güncel teknoloji",
    "yapay zeka",
    "yazılım",
    "donanım",
    "bilim",
    "dijital",
  ],
  authors: [{ name: "Güncel Tekno" }],
  creator: "Güncel Tekno",
  publisher: "Güncel Tekno",
  metadataBase: new URL("https://www.guncelteknoloji.com"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Güncel Tekno",
    title: "Güncel Tekno - Güncel Tekno Haberleri",
    description:
      "Teknoloji dünyasındaki en son gelişmeler, yapay zeka, yazılım, donanım, bilim ve dijital dönüşüm haberlerini takip edin.",
    url: "https://www.guncelteknoloji.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@guncelteknoloji",
    creator: "@guncelteknoloji",
    title: "Güncel Tekno - Güncel Tekno Haberleri",
    description:
      "Teknoloji dünyasındaki en son gelişmeler, yapay zeka, yazılım, donanım, bilim ve dijital dönüşüm haberlerini takip edin.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  verification: {
    google: "yNTr5OJEElvjf2UyzzvWwNJh_zVEF_VEsvCYfXqVP6k",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
