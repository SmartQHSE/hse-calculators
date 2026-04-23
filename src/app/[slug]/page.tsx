import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS, getCalculator } from "@/core/registry";
import { getRichContent } from "@/core/rich-content";
import CalculatorForm from "@/components/CalculatorForm";
import EmbedSnippet from "@/components/EmbedSnippet";

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

const escapeLd = (d: unknown) => JSON.stringify(d).replace(/</g, "\\u003c");

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) notFound();

  const url = `https://tools.smartqhse.com/${calc.slug}`;
  const rich = getRichContent(calc);

  // Related calcs — prefer rich-content recommendations, fallback to same category
  const relatedSlugs = rich.relatedCalcs.length
    ? rich.relatedCalcs
    : CALCULATORS.filter((c) => c.category === calc.category && c.slug !== calc.slug)
        .slice(0, 4)
        .map((c) => c.slug);
  const related = relatedSlugs
    .map((s) => getCalculator(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 6);

  // JSON-LD graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name: calc.name,
        url,
        description: calc.seoDescription,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any (web)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        creator: {
          "@type": "Organization",
          name: "SmartQHSE",
          url: "https://www.smartqhse.com",
        },
        publisher: {
          "@type": "Organization",
          name: "SmartQHSE Ltd",
          url: "https://www.smartqhse.com",
        },
        isAccessibleForFree: true,
      },
      {
        "@type": "FAQPage",
        mainEntity: rich.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "HowTo",
        name: `How to use the ${calc.name}`,
        description: calc.seoDescription,
        url,
        step: rich.howToUse.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Tools", item: "https://tools.smartqhse.com" },
          { "@type": "ListItem", position: 2, name: calc.name, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json">{escapeLd(jsonLd)}</script>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0A2540] to-[#0D3356] border-b border-[#1a3a60]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <nav className="text-xs text-slate-400 mb-6 font-mono uppercase tracking-widest flex items-center gap-2">
            <Link href="/" className="hover:text-[#00C897]">Tools</Link>
            <span>/</span>
            <span className="text-slate-300 normal-case tracking-normal">
              {calc.category.replace("-", " ")}
            </span>
            <span>/</span>
            <span className="text-slate-200 normal-case tracking-normal">{calc.name}</span>
          </nav>

          <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00C897]/30 bg-[#00C897]/10 font-mono text-[11px] uppercase tracking-widest text-[#00C897]">
            {calc.category.replace("-", " ")} · Free · Open Source · MIT
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl mb-5">
            {calc.name}
          </h1>

          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            {calc.shortDescription}. Based on <strong>{calc.regulation}</strong>. Results shown with
            the full formula so you can verify. Zero signup, zero tracking, zero data sent to a
            server — all calculation is client-side.
          </p>
        </div>
      </section>

      {/* Calculator + results */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <CalculatorForm calc={calc} benchmarks={rich.benchmarks} />
      </section>

      {/* Intro — keyword-rich */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">
            Overview
          </div>
          <h2 className="text-2xl font-bold text-[#0F2A44] mb-5 leading-tight">
            About the {calc.name}
          </h2>
          <div className="prose prose-slate max-w-none">
            {rich.intro.split("\n\n").map((p, i) => (
              <p key={i} className="text-[15px] text-slate-700 leading-relaxed mb-4">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Formula + regulation */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <div className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-3">
              Formula
            </div>
            <code className="block p-4 bg-slate-900 text-slate-100 rounded-lg text-[13px] font-mono break-words">
              {calc.formula}
            </code>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <div className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-3">
              Regulation
            </div>
            <p className="text-[15px] text-[#0F2A44] font-semibold mb-2">{calc.regulation}</p>
            {calc.regulationUrl && (
              <a
                href={calc.regulationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#0F2A44] underline hover:text-[#00C897]"
              >
                View authoritative source →
              </a>
            )}
          </div>
        </div>
      </section>

      {/* How to use */}
      {rich.howToUse.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">
              How to use
            </div>
            <h2 className="text-2xl font-bold text-[#0F2A44] mb-6 leading-tight">
              Step-by-step: using the {calc.name}
            </h2>
            <ol className="space-y-3">
              {rich.howToUse.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-[#00C897] text-[#0F2A44] font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div className="text-[15px] text-slate-700 leading-relaxed pt-0.5">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Worked examples */}
      {rich.examples.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-14">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">
            Worked examples
          </div>
          <h2 className="text-2xl font-bold text-[#0F2A44] mb-6 leading-tight">
            {calc.name} — real-world examples
          </h2>
          <div className="space-y-4">
            {rich.examples.map((ex, i) => (
              <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white">
                <div className="font-semibold text-[#0F2A44] mb-2">{ex.title}</div>
                <p className="text-[14px] text-slate-700 leading-relaxed">{ex.narrative}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Who uses it */}
      {rich.whoUses.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">
              Who uses this calculator
            </div>
            <h2 className="text-2xl font-bold text-[#0F2A44] mb-6 leading-tight">
              Used by safety professionals worldwide
            </h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {rich.whoUses.map((w, i) => (
                <li key={i} className="flex gap-3 items-start text-[14px] text-slate-700">
                  <span className="text-[#00C897] mt-1.5 text-[8px]">●</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Common mistakes */}
      {rich.commonMistakes.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-14">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">
            Watch out for
          </div>
          <h2 className="text-2xl font-bold text-[#0F2A44] mb-6 leading-tight">
            Common mistakes when calculating {calc.name.toLowerCase()}
          </h2>
          <ul className="space-y-3">
            {rich.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-3 items-start text-[14px] text-slate-700">
                <span className="text-[#DC2626] mt-1 font-bold">⚠</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {rich.faqs.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">
              FAQ
            </div>
            <h2 className="text-2xl font-bold text-[#0F2A44] mb-6 leading-tight">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {rich.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="p-5 rounded-xl border border-slate-200 bg-white group"
                >
                  <summary className="cursor-pointer font-semibold text-[#0F2A44] text-[15px] marker:hidden list-none flex items-center justify-between">
                    <span>{faq.q}</span>
                    <span className="text-[#00C897] group-open:rotate-45 transition-transform text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[14px] text-slate-700 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Citations */}
      {rich.citations.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-14">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">
            Regulation citations
          </div>
          <h2 className="text-2xl font-bold text-[#0F2A44] mb-6 leading-tight">
            Authoritative sources
          </h2>
          <ul className="space-y-2">
            {rich.citations.map((c, i) => (
              <li key={i}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border border-slate-200 bg-white hover:border-[#0F2A44] transition-colors"
                >
                  <div className="text-[14px] text-[#0F2A44] font-semibold">{c.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">{c.url}</div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related calculators */}
      {related.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">
              Related calculators
            </div>
            <h2 className="text-2xl font-bold text-[#0F2A44] mb-6 leading-tight">
              More free HSE calculators
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="block p-5 rounded-xl border border-slate-200 bg-white hover:border-[#0F2A44] hover:shadow-sm transition-all"
                >
                  <div className="font-semibold text-[#0F2A44] mb-1 text-[15px]">{c.name}</div>
                  <div className="text-[13px] text-slate-500 leading-relaxed">
                    {c.shortDescription}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Embed snippet */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <EmbedSnippet slug={calc.slug} name={calc.name} />
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0D3356] text-white">
          <div className="font-mono text-[11px] uppercase tracking-widest text-[#00C897] mb-2">
            Track this KPI automatically
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
            Need more than a calculator?
          </h2>
          <p className="text-[14px] text-slate-300 mb-5 max-w-2xl">
            SmartQHSE is the AI-powered HSE / QHSE platform built on top of these formulas —
            permits-to-work, AI risk assessments, incident management, contractor prequalification,
            ISO 45001 compliance dashboards. Used in 40+ countries.
          </p>
          <a
            href="https://www.smartqhse.com?utm_source=tools&utm_medium=calculator&utm_campaign=cta"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#00C897] text-[#0F2A44] font-semibold hover:opacity-90"
          >
            Start free on smartqhse.com →
          </a>
        </div>
      </section>
    </>
  );
}
