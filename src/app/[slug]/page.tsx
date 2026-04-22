import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS, getCalculator } from "@/core/registry";
import CalculatorForm from "@/components/CalculatorForm";

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) return { title: "Not found" };
  const url = `https://tools.smartqhse.com/${calc.slug}`;
  return {
    title: calc.seoTitle,
    description: calc.seoDescription,
    keywords: calc.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: calc.seoTitle,
      description: calc.seoDescription,
      url,
      siteName: "SmartQHSE Tools",
      type: "website",
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) notFound();

  const url = `https://tools.smartqhse.com/${calc.slug}`;
  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: calc.name,
        url,
        description: calc.seoDescription,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any (web)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: {
          "@type": "Organization",
          name: "SmartQHSE",
          url: "https://www.smartqhse.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Tools", item: "https://tools.smartqhse.com" },
          { "@type": "ListItem", position: 2, name: calc.name, item: url },
        ],
      },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <script type="application/ld+json">{ld}</script>
      <nav className="text-xs text-slate-500 mb-6 font-mono">
        <Link href="/" className="hover:text-slate-900">
          ← All calculators
        </Link>
      </nav>
      <header className="mb-8">
        <div className="font-mono text-xs uppercase tracking-widest text-[#00C897] mb-3">
          {calc.category.replace("-", " ")}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F2A44] mb-3">
          {calc.name}
        </h1>
        <p className="text-slate-600 leading-relaxed">{calc.seoDescription}</p>
      </header>

      <section className="p-6 rounded-xl border border-slate-200 bg-white">
        <CalculatorForm calc={calc} />
      </section>

      <section className="mt-10 space-y-6 text-sm">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2">
            Formula
          </div>
          <code className="block p-3 bg-slate-100 rounded-lg text-slate-800 font-mono text-xs">
            {calc.formula}
          </code>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2">
            Regulation
          </div>
          <p className="text-slate-700">
            {calc.regulation}
            {calc.regulationUrl && (
              <>
                {" · "}
                <a href={calc.regulationUrl} className="underline">
                  Source
                </a>
              </>
            )}
          </p>
        </div>
      </section>

      <section className="mt-10 p-6 rounded-xl bg-[#0F2A44] text-white">
        <h2 className="text-lg font-semibold mb-2">Need more than a calculator?</h2>
        <p className="text-sm text-slate-300 mb-4">
          SmartQHSE is the AI-powered HSE / QHSE management platform built on top of these formulas
          — permits-to-work, AI-generated risk assessments, incident management, contractor
          prequalification, and ISO 45001 compliance dashboards.
        </p>
        <a
          href="https://www.smartqhse.com"
          className="inline-block px-4 py-2 rounded-lg bg-[#00C897] text-[#0F2A44] font-semibold text-sm hover:opacity-90"
        >
          Start free on smartqhse.com →
        </a>
      </section>

      <section className="mt-10 flex flex-wrap gap-3 text-xs text-slate-500">
        <a href="https://github.com/SmartQHSE/hse-calculators" className="underline">
          GitHub
        </a>
        <span>·</span>
        <a href="https://www.npmjs.com/package/@smartqhse/hse-calculators" className="underline">
          npm
        </a>
        <span>·</span>
        <a href="https://www.smartqhse.com/safety-blog" className="underline">
          HSE blog
        </a>
        <span>·</span>
        <a href="https://www.smartqhse.com/hse-glossary" className="underline">
          HSE glossary
        </a>
        <span>·</span>
        <a href="https://www.smartqhse.com/regulations" className="underline">
          Regulations index
        </a>
      </section>
    </main>
  );
}
