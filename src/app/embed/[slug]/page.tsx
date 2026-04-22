import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CALCULATORS, getCalculator } from "@/core/registry";
import CalculatorForm from "@/components/CalculatorForm";
import ResizeReporter from "./ResizeReporter";

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
  return {
    title: `${calc.name} — Embed | SmartQHSE`,
    robots: { index: false, follow: true },
    alternates: { canonical: `https://tools.smartqhse.com/${calc.slug}` },
  };
}

// The embed route renders the calculator stripped of navigation / marketing
// chrome. Posts its height to the parent via postMessage so the loader can
// size the iframe correctly.
export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) notFound();

  return (
    <>
      <ResizeReporter />
      <div className="p-5 font-sans bg-white text-[#0F172A]">
        <div className="mb-3">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#00C897] mb-1">
            {calc.category.replace("-", " ")}
          </div>
          <h1 className="text-lg font-bold text-[#0F2A44]">{calc.name}</h1>
          <p className="text-xs text-slate-500 mt-1">{calc.shortDescription}</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <CalculatorForm calc={calc} />
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div>
            <span className="font-mono">{calc.formula}</span>
          </div>
          <a
            href={`https://tools.smartqhse.com/${calc.slug}?utm_source=embed&utm_medium=iframe`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#0F2A44] hover:text-[#00C897]"
          >
            Powered by SmartQHSE →
          </a>
        </div>
      </div>
    </>
  );
}
