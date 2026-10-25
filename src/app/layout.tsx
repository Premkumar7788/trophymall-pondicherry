import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trophy Mall Pondicherry | Premier Trophies, Awards, Medals & Laser Engraving Showroom",
  description:
    "Pondicherry's leading trophies and awards showroom located on Airport Road, Lawspet. 500+ physical samples, free on-the-spot laser plate engraving, instant WhatsApp design proofs, school & college sports bulk discounts.",
  keywords: [
    "Trophy Mall Pondicherry",
    "Trophy showroom Pondicherry",
    "Trophies Lawspet Puducherry",
    "Cricket trophies Pondicherry",
    "School sports day medals Pondicherry",
    "Laser engraved awards Puducherry",
    "Corporate acrylic mementos Pondicherry",
    "Championship cups Pondicherry",
    "Pondicherry University medals",
    "JIPMER SMVEC trophies",
  ],
  authors: [{ name: "Trophy Mall Pondicherry" }],
  openGraph: {
    title: "Trophy Mall Pondicherry | Trophies, Awards & Medals Showroom",
    description:
      "Explore 500+ in-store trophy samples at Lawspet, Pondicherry. Free laser engraving & instant WhatsApp quotes.",
    url: "https://trophymall.shop",
    siteName: "Trophy Mall Pondicherry",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
