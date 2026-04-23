"use client";

import type { BenchmarkRow } from "@/core/rich-content";

interface Props {
  rows: BenchmarkRow[];
  unit: string;
  source: string;
  sourceUrl: string;
  thresholds?: { good: number; average: number };
  userValue?: number | null;
}

export default function BenchmarkBars({
  rows,
  unit,
  source,
  sourceUrl,
  thresholds,
  userValue,
}: Props) {
  const maxValue = Math.max(...rows.map((r) => r.value), userValue ?? 0) * 1.1 || 1;

  function barColour(value: number): string {
    if (!thresholds) return "#0F2A44";
    if (value <= thresholds.good) return "#10B981";
    if (value <= thresholds.average) return "#F59E0B";
    return "#DC2626";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-[#0F2A44]">Industry benchmark comparison</h2>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-slate-500 hover:text-[#0F2A44] underline"
        >
          Source: {source}
        </a>
      </div>

      <div className="mb-4 text-xs text-slate-500 font-mono">Values in {unit}</div>

      <div className="space-y-2.5">
        {rows.map((row) => {
          const widthPct = (row.value / maxValue) * 100;
          return (
            <div key={row.industry} className="grid grid-cols-[1fr_minmax(0,2fr)_auto] gap-3 items-center">
              <div className="text-[13px] text-slate-700 truncate">{row.industry}</div>
              <div className="h-6 bg-slate-100 rounded-md overflow-hidden relative">
                <div
                  className="h-full rounded-md"
                  style={{
                    width: `${widthPct}%`,
                    background: barColour(row.value),
                    opacity: row.label ? 0.6 : 1,
                  }}
                />
              </div>
              <div className="text-sm font-mono font-semibold text-[#0F2A44] tabular-nums min-w-[3rem] text-right">
                {row.value}
                {row.label && (
                  <span className="ml-1 text-[10px] uppercase tracking-widest text-slate-500">
                    {row.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {userValue != null && userValue > 0 && (
          <div className="grid grid-cols-[1fr_minmax(0,2fr)_auto] gap-3 items-center pt-3 mt-2 border-t-2 border-[#00C897]">
            <div className="text-[13px] font-semibold text-[#0F2A44]">Your value</div>
            <div className="h-6 bg-slate-100 rounded-md overflow-hidden relative">
              <div
                className="h-full rounded-md"
                style={{
                  width: `${Math.min(100, (userValue / maxValue) * 100)}%`,
                  background: barColour(userValue),
                  boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.1)",
                }}
              />
            </div>
            <div className="text-sm font-mono font-bold text-[#00C897] tabular-nums min-w-[3rem] text-right">
              {userValue}
            </div>
          </div>
        )}
      </div>

      {thresholds && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#10B981]" />
            Good — ≤ {thresholds.good}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#F59E0B]" />
            Average — ≤ {thresholds.average}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#DC2626]" />
            High — &gt; {thresholds.average}
          </span>
        </div>
      )}
    </div>
  );
}
