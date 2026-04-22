import Link from "next/link";
import { CALCULATORS } from "@/core/registry";

export default function HomePage() {
  const byCategory = CALCULATORS.reduce<Record<string, typeof CALCULATORS>>((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    "incident-rates": "Incident rate calculators",
    exposure: "Occupational exposure",
    ergonomics: "Ergonomics",
    environmental: "Environmental",
    fire: "Fire safety",
    workload: "Workload & manhours",
    risk: "Risk scoring",
    cost: "Cost & insurance",
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-14">
        <div className="font-mono text-xs uppercase tracking-widest text-[#00C897] mb-3">
          SmartQHSE · Open Source · MIT
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F2A44] mb-4">
          Free HSE Calculators
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          30+ health, safety and environment (HSE / EHS / QHSE) calculators. Every formula cites the
          source regulation — OSHA, HSE UK, ISO 45001, ILO, NIOSH, ACGIH, NFPA. Zero signup, zero ads,
          zero runtime dependencies. Used by construction, oil & gas, manufacturing, and industrial
          safety teams worldwide.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a
            href="https://github.com/SmartQHSE/hse-calculators"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:border-slate-500"
          >
            ⭐ Star on GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@smartqhse/hse-calculators"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:border-slate-500"
          >
            📦 npm install
          </a>
          <a
            href="https://www.smartqhse.com"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F2A44] text-white hover:bg-[#1a3a60]"
          >
            Get the full HSE platform →
          </a>
        </div>
      </header>

      {Object.entries(byCategory).map(([cat, items]) => (
        <section key={cat} className="mb-14">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-5">
            {categoryLabels[cat] ?? cat}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="block p-5 rounded-xl border border-slate-200 hover:border-[#0F2A44] hover:shadow-sm transition"
              >
                <div className="font-semibold text-[#0F2A44] mb-1">{c.name}</div>
                <div className="text-sm text-slate-600 mb-3">{c.shortDescription}</div>
                <div className="text-xs font-mono text-slate-400 truncate">{c.formula}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer className="mt-20 pt-10 border-t border-slate-200 text-sm text-slate-500">
        <p>
          Built by{" "}
          <a href="https://www.smartqhse.com" className="text-[#0F2A44] font-semibold">
            SmartQHSE
          </a>{" "}
          — the AI-powered HSE management platform for construction, oil & gas, and industrial teams.
          Used in 40+ countries. <a href="https://www.smartqhse.com" className="underline">Start free →</a>
        </p>
        <p className="mt-2">
          MIT licensed. Contributions welcome at{" "}
          <a href="https://github.com/SmartQHSE/hse-calculators" className="underline">
            github.com/SmartQHSE/hse-calculators
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
