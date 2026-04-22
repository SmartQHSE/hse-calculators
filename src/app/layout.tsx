import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tools.smartqhse.com"),
  title: {
    default: "Free HSE Calculators — TRIR, LTIR, LTIFR, WBGT, Risk Matrix | SmartQHSE",
    template: "%s | SmartQHSE Tools",
  },
  description:
    "30+ free HSE (Health, Safety, Environment) calculators — TRIR, LTIR, LTIFR, DART, EMR, severity rate, WBGT heat stress, noise dose, hand-arm vibration, REBA, RULA, NIOSH lifting, fire load, evacuation time, risk matrix. Regulation-cited (OSHA, HSE UK, ISO 45001, ILO). Open source MIT.",
  keywords: [
    "HSE calculator",
    "EHS calculator",
    "TRIR calculator",
    "LTIR calculator",
    "LTIFR calculator",
    "DART rate calculator",
    "EMR calculator",
    "severity rate calculator",
    "frequency rate calculator",
    "OSHA incident rate calculator",
    "RIDDOR calculator",
    "WBGT calculator",
    "heat stress calculator",
    "noise dose calculator",
    "hand arm vibration calculator",
    "HAV calculator",
    "whole body vibration calculator",
    "REBA calculator",
    "RULA calculator",
    "NIOSH lifting equation",
    "manual handling calculator",
    "fire load calculator",
    "evacuation time calculator",
    "manhours calculator",
    "risk matrix calculator",
    "5x5 risk matrix",
    "ISO 45001",
    "OSHA compliance",
    "HSE software",
    "EHS software",
    "safety metrics",
    "safety KPI",
  ],
  openGraph: {
    title: "Free HSE Calculators — Open Source, Regulation-Cited",
    description:
      "30+ health & safety calculators. Pure TypeScript, zero dependencies, MIT licensed. Built by SmartQHSE.",
    url: "https://tools.smartqhse.com",
    siteName: "SmartQHSE Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free HSE Calculators",
    description: "TRIR, LTIR, LTIFR, WBGT, REBA, risk matrix and more. Open source.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://tools.smartqhse.com" },
};

const SITE_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SmartQHSE Tools — Free HSE Calculators",
  url: "https://tools.smartqhse.com",
  publisher: {
    "@type": "Organization",
    name: "SmartQHSE",
    url: "https://www.smartqhse.com",
    sameAs: [
      "https://github.com/SmartQHSE",
      "https://www.linkedin.com/company/112255913",
      "https://www.g2.com/products/smartqhse/reviews",
      "https://www.capterra.com/p/10039118/SmartQHSE",
    ],
  },
}).replace(/</g, "\\u003c");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json">{SITE_LD}</script>
      </head>
      <body>{children}</body>
    </html>
  );
}
