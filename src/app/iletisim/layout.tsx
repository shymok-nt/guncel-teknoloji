import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "İletişim | Güncel Tekno",
  description:
    "Güncel Tekno iletişim sayfası. Soru, öneri ve iş birlikleriniz için bize ulaşın.",
  openGraph: {
    title: "İletişim | Güncel Tekno",
    description: "Soru, öneri ve iş birlikleriniz için bize ulaşın.",
    url: "https://www.guncelteknoloji.com/iletisim",
    siteName: "Güncel Tekno",
    locale: "tr_TR",
    type: "website",
  },
};

export default function IletisimLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
