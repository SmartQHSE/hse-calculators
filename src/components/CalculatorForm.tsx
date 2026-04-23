"use client";

import { useMemo, useState } from "react";
import type { CalculatorMeta } from "@/core/types";
import * as core from "@/core";
import BenchmarkBars from "./BenchmarkBars";
import type { BenchmarkRow } from "@/core/rich-content";

const DISPATCH: Record<string, (input: Record<string, number | string>) => unknown> = {
  "trir-calculator": (i) =>
    core.calculateTRIR({
      recordableIncidents: Number(i.recordableIncidents),
      hoursWorked: Number(i.hoursWorked),
    }),
  "ltir-calculator": (i) =>
    core.calculateLTIR({
      lostTimeIncidents: Number(i.lostTimeIncidents),
      hoursWorked: Number(i.hoursWorked),
    }),
  "ltifr-calculator": (i) =>
    core.calculateLTIFR({
      lostTimeInjuries: Number(i.lostTimeInjuries),
      hoursWorked: Number(i.hoursWorked),
    }),
  "dart-rate-calculator": (i) =>
    core.calculateDART({ dartCases: Number(i.dartCases), hoursWorked: Number(i.hoursWorked) }),
  "severity-rate-calculator": (i) =>
    core.calculateSeverityRate({
      daysLost: Number(i.daysLost),
      hoursWorked: Number(i.hoursWorked),
      base: i.base as "osha" | "iso",
    }),
  "frequency-rate-calculator": (i) =>
    core.calculateFrequencyRate({
      accidents: Number(i.accidents),
      hoursWorked: Number(i.hoursWorked),
    }),
  "emr-calculator": (i) =>
    core.calculateEMR({
      actualLosses: Number(i.actualLosses),
      expectedLosses: Number(i.expectedLosses),
    }),
  "incident-cost-calculator": (i) =>
    core.calculateIncidentCost({
      directCost: Number(i.directCost),
      severity: i.severity as "firstAid" | "medical" | "restricted" | "lostTime" | "fatality",
    }),
  "noise-dose-calculator": (i) =>
    core.calculateNoiseDose({
      leq: Number(i.leq),
      hours: Number(i.hours),
      exchangeRate: Number(i.exchangeRate) as 3 | 5,
    }),
  "hav-calculator": (i) =>
    core.calculateHAV({
      vibrationMs2: Number(i.vibrationMs2),
      exposureHours: Number(i.exposureHours),
    }),
  "wbv-calculator": (i) =>
    core.calculateWBV({
      vibrationMs2: Number(i.vibrationMs2),
      exposureHours: Number(i.exposureHours),
      axis: i.axis as "x" | "y" | "z",
    }),
  "wbgt-calculator": (i) =>
    core.calculateWBGT({
      tempC: Number(i.tempC),
      humidity: Number(i.humidity),
      globeTempC: Number(i.globeTempC),
      indoor: i.indoor === "indoor",
    }),
  "carbon-footprint-calculator": (i) =>
    core.calculateCarbonFootprint({
      scope1: { dieselL: Number(i.dieselL) },
      scope2: {
        electricityKwh: Number(i.electricityKwh),
        region: i.region as "world" | "uae" | "ksa" | "uk" | "usa",
      },
      scope3: { flightKmLong: Number(i.flightKmLong), carKm: Number(i.carKm) },
    }),
  "niosh-lifting-calculator": (i) =>
    core.calculateNIOSHLift({
      horizontalCm: Number(i.horizontalCm),
      verticalCm: Number(i.verticalCm),
      verticalTravelCm: Number(i.verticalTravelCm),
      angleDegrees: Number(i.angleDegrees),
      frequencyPerMin: Number(i.frequencyPerMin),
      durationHours: Number(i.durationHours),
      couplingQuality: i.couplingQuality as "good" | "fair" | "poor",
      loadKg: Number(i.loadKg),
    }),
  "manual-handling-calculator": (i) =>
    core.calculateManualHandling({
      loadKg: Number(i.loadKg),
      distanceM: Number(i.distanceM),
      frequencyPerHour: Number(i.frequencyPerHour),
    }),
  "fire-load-calculator": (i) =>
    core.calculateFireLoad({
      floorAreaM2: Number(i.floorAreaM2),
      items: [
        { materialKg: Number(i.woodKg), material: "wood" },
        { materialKg: Number(i.paperKg), material: "paper" },
        { materialKg: Number(i.plasticKg), material: "plastic" },
      ],
    }),
  "evacuation-time-calculator": (i) =>
    core.calculateEvacuationTime({
      occupants: Number(i.occupants),
      travelDistanceM: Number(i.travelDistanceM),
      exitWidthM: Number(i.exitWidthM),
      preMovementTimeS: Number(i.preMovementTimeS),
    }),
  "manhours-calculator": (i) =>
    core.calculateManhours({
      workers: Number(i.workers),
      hoursPerDay: Number(i.hoursPerDay),
      days: Number(i.days),
      overtimePct: Number(i.overtimePct),
    }),
  "risk-matrix-calculator": (i) =>
    core.calculateRiskMatrix({
      likelihood: Number(i.likelihood),
      severity: Number(i.severity),
      matrix: i.matrix as "4x4" | "5x5",
    }),
  "safety-score-calculator": (i) =>
    core.calculateSafetyScore({
      trir: Number(i.trir),
      ltifr: Number(i.ltifr),
      nearMissReporting: Number(i.nearMissReporting),
      trainingComplete: Number(i.trainingComplete),
      auditCompliance: Number(i.auditCompliance),
    }),
  "stress-risk-calculator": (i) =>
    core.calculateStressRisk({
      demands: Number(i.demands),
      control: Number(i.control),
      support: Number(i.support),
      relationships: Number(i.relationships),
      role: Number(i.role),
      change: Number(i.change),
    }),
};

interface Props {
  calc: CalculatorMeta;
  benchmarks?: {
    unit: string;
    source: string;
    sourceUrl: string;
    rows: BenchmarkRow[];
    thresholds?: { good: number; average: number };
  };
}

export default function CalculatorForm({ calc, benchmarks }: Props) {
  const initial = useMemo(() => {
    const s: Record<string, number | string> = {};
    for (const input of calc.inputs) {
      s[input.id] = input.defaultValue ?? (input.type === "number" ? 0 : "");
    }
    return s;
  }, [calc]);

  const [values, setValues] = useState<Record<string, number | string>>(initial);

  const result = useMemo(() => {
    try {
      const fn = DISPATCH[calc.slug];
      if (!fn) return null;
      return fn(values);
    } catch {
      return null;
    }
  }, [calc.slug, values]);

  const userValue = getPrimaryValue(result);

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <section className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 bg-white">
        <div className="font-mono text-xs uppercase tracking-widest text-[#00C897] mb-4">Inputs</div>
        <div className="space-y-4">
          {calc.inputs.map((input) => (
            <div key={input.id}>
              <label className="block text-[13px] font-medium text-[#0F2A44] mb-1">
                {input.label}
                {input.unit && <span className="text-slate-400 font-normal"> ({input.unit})</span>}
              </label>
              {input.type === "number" ? (
                <input
                  type="number"
                  value={String(values[input.id] ?? "")}
                  onChange={(e) => setValues({ ...values, [input.id]: e.target.value })}
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00C897] focus:outline-none text-sm"
                />
              ) : (
                <select
                  value={String(values[input.id] ?? "")}
                  onChange={(e) => setValues({ ...values, [input.id]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00C897] focus:outline-none text-sm"
                >
                  {input.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
              {input.help && (
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{input.help}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="lg:col-span-3 space-y-4">
        <ResultDashboard calc={calc} result={result} />

        {benchmarks && benchmarks.rows.length > 0 && (
          <BenchmarkBars
            rows={benchmarks.rows}
            unit={benchmarks.unit}
            source={benchmarks.source}
            sourceUrl={benchmarks.sourceUrl}
            thresholds={benchmarks.thresholds}
            userValue={userValue}
          />
        )}

        <details className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 group">
          <summary className="cursor-pointer text-[11px] font-mono uppercase tracking-widest text-slate-500 group-open:mb-3">
            Raw JSON result
          </summary>
          <pre className="bg-[#0A2540] text-slate-100 p-3 rounded-lg text-[11px] overflow-x-auto">
            {result == null ? "—" : JSON.stringify(result, null, 2)}
          </pre>
        </details>
      </section>
    </div>
  );
}

// ── Rich result dashboard ──────────────────────────────────────────────
function ResultDashboard({ calc, result }: { calc: CalculatorMeta; result: unknown }) {
  if (result == null) {
    return (
      <div className="p-8 rounded-2xl border border-dashed border-slate-300 text-center text-sm text-slate-500">
        Enter values to calculate
      </div>
    );
  }

  const category = calc.category;
  const r = result as Record<string, unknown>;

  if (category === "incident-rates" && typeof r.rate === "number") {
    const rate = r.rate as number;
    const base = r.base as number;
    const formula = r.formula as string;
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0D3356] text-white">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#00C897] mb-2">
          {calc.name} result
        </div>
        <div className="flex items-baseline gap-3 mb-2">
          <div className="text-5xl font-bold tabular-nums">{rate}</div>
          <div className="text-xs text-slate-300">per {base.toLocaleString()} hours</div>
        </div>
        <div className="font-mono text-[11px] text-slate-400 mb-5">{formula}</div>
        <div className="grid grid-cols-2 gap-3">
          <MiniCard
            label="Equivalent LTIFR (1M base)"
            value={(rate * (1_000_000 / base)).toFixed(2)}
            hint="ISO 45001 / ILO international standard"
          />
          <MiniCard
            label="Equivalent OSHA (200k base)"
            value={(rate * (200_000 / base)).toFixed(2)}
            hint="OSHA 29 CFR 1904.7 US standard"
          />
        </div>
      </div>
    );
  }

  if (calc.slug === "risk-matrix-calculator" && typeof r.score === "number") {
    const score = r.score as number;
    const band = r.band as string;
    const color = r.color as string;
    const action = r.action as string;
    const matrix = r.matrix as string;
    return (
      <div className="p-6 rounded-2xl text-white" style={{ background: color }}>
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-1">
          {matrix} risk matrix · {band.toUpperCase()}
        </div>
        <div className="flex items-baseline gap-3 mb-1">
          <div className="text-5xl font-bold tabular-nums">{score}</div>
          <div className="text-xs opacity-80">risk score</div>
        </div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
    );
  }

  if (calc.slug === "emr-calculator" && typeof r.emr === "number") {
    const emr = r.emr as number;
    const band = r.band as string;
    const savings = r.savingsVsBaseline as string;
    const emrColour =
      band === "excellent"
        ? "#10B981"
        : band === "good"
          ? "#84CC16"
          : band === "neutral"
            ? "#64748B"
            : "#DC2626";
    return (
      <div className="p-6 rounded-2xl text-white" style={{ background: emrColour }}>
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-2">
          Experience Modification Rate
        </div>
        <div className="flex items-baseline gap-3 mb-1">
          <div className="text-5xl font-bold tabular-nums">{emr}</div>
          <div className="text-xs opacity-80">× baseline premium</div>
        </div>
        <div className="text-sm font-semibold mb-4">
          Band: {band} · {savings} vs baseline
        </div>
      </div>
    );
  }

  if (calc.slug === "wbgt-calculator" && typeof r.wbgt === "number") {
    const wbgt = r.wbgt as number;
    const risk = r.riskLevel as string;
    const ratio = r.acgihWorkRestRatio as string;
    const cols: Record<string, string> = {
      low: "#10B981",
      moderate: "#F59E0B",
      high: "#F97316",
      extreme: "#DC2626",
    };
    return (
      <div className="p-6 rounded-2xl text-white" style={{ background: cols[risk] ?? "#0F2A44" }}>
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-2">
          WBGT heat stress · {risk.toUpperCase()}
        </div>
        <div className="flex items-baseline gap-3 mb-1">
          <div className="text-5xl font-bold tabular-nums">{wbgt}°C</div>
        </div>
        <div className="text-sm font-semibold mb-2">Work/rest: {ratio}</div>
        <div className="text-[11px] opacity-80">
          ACGIH TLV / ISO 7243 — moderate workload, acclimatised
        </div>
      </div>
    );
  }

  if (
    (calc.slug === "hav-calculator" || calc.slug === "wbv-calculator") &&
    typeof r.value === "number"
  ) {
    const val = r.value as number;
    const unit = r.unit as string;
    const actionExceeded = r.actionLevelExceeded as boolean;
    const limitExceeded = r.limitExceeded as boolean;
    const eav = r.eav as number;
    const elv = r.elv as number;
    const status = limitExceeded ? "ABOVE LIMIT" : actionExceeded ? "ABOVE ACTION" : "ACCEPTABLE";
    const color = limitExceeded ? "#DC2626" : actionExceeded ? "#F59E0B" : "#10B981";
    return (
      <div className="p-6 rounded-2xl text-white" style={{ background: color }}>
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-2">
          Daily vibration exposure · {status}
        </div>
        <div className="flex items-baseline gap-3 mb-3">
          <div className="text-5xl font-bold tabular-nums">{val}</div>
          <div className="text-xs opacity-80">{unit}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>EAV: {eav} {unit}</div>
          <div>ELV: {elv} {unit}</div>
        </div>
      </div>
    );
  }

  if (calc.slug === "niosh-lifting-calculator" && typeof r.rwl === "number") {
    const rwl = r.rwl as number;
    const li = r.li as number;
    const risk = r.risk as string;
    const cols = { acceptable: "#10B981", increased: "#F59E0B", high: "#DC2626" };
    return (
      <div
        className="p-6 rounded-2xl text-white"
        style={{ background: cols[risk as keyof typeof cols] ?? "#0F2A44" }}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-2">
          NIOSH Lifting Equation · {risk.toUpperCase()}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] opacity-80 mb-1 font-mono uppercase tracking-widest">
              Recommended Weight Limit
            </div>
            <div className="text-3xl font-bold tabular-nums">{rwl} kg</div>
          </div>
          <div>
            <div className="text-[10px] opacity-80 mb-1 font-mono uppercase tracking-widest">
              Lifting Index
            </div>
            <div className="text-3xl font-bold tabular-nums">{li}</div>
          </div>
        </div>
      </div>
    );
  }

  if (calc.slug === "manhours-calculator" && typeof r.total === "number") {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0D3356] text-white">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#00C897] mb-3">
          Total exposure hours
        </div>
        <div className="text-5xl font-bold tabular-nums mb-4">
          {(r.total as number).toLocaleString()}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MiniCard label="Regular" value={(r.regular as number).toLocaleString()} />
          <MiniCard label="Overtime" value={(r.overtime as number).toLocaleString()} />
          <MiniCard label="TRIR/LTIR base" value="rate denominator" />
        </div>
      </div>
    );
  }

  if (calc.slug === "incident-cost-calculator" && typeof r.total === "number") {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7F1D1D] to-[#B91C1C] text-white">
        <div className="font-mono text-[10px] uppercase tracking-widest text-white/70 mb-3">
          Total incident cost
        </div>
        <div className="text-5xl font-bold tabular-nums mb-4">
          ${(r.total as number).toLocaleString()}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MiniCard label="Direct" value={`$${(r.direct as number).toLocaleString()}`} />
          <MiniCard label="Indirect (hidden)" value={`$${(r.indirect as number).toLocaleString()}`} />
          <MiniCard
            label="Revenue needed (10%)"
            value={`$${(r.revenueNeeded as number).toLocaleString()}`}
          />
        </div>
      </div>
    );
  }

  if (calc.slug === "carbon-footprint-calculator" && typeof r.total === "number") {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#065F46] to-[#047857] text-white">
        <div className="font-mono text-[10px] uppercase tracking-widest text-white/70 mb-3">
          Carbon footprint · GHG Protocol
        </div>
        <div className="text-5xl font-bold tabular-nums mb-4">
          {(r.total as number).toLocaleString()}{" "}
          <span className="text-sm font-normal opacity-70">kg CO₂e</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MiniCard label="Scope 1 (direct)" value={(r.scope1 as number).toLocaleString()} />
          <MiniCard label="Scope 2 (electricity)" value={(r.scope2 as number).toLocaleString()} />
          <MiniCard label="Scope 3 (value chain)" value={(r.scope3 as number).toLocaleString()} />
        </div>
      </div>
    );
  }

  if (calc.slug === "safety-score-calculator" && typeof r.score === "number") {
    const grade = r.grade as string;
    const cols: Record<string, string> = {
      A: "#10B981",
      B: "#84CC16",
      C: "#F59E0B",
      D: "#F97316",
      F: "#DC2626",
    };
    return (
      <div className="p-6 rounded-2xl text-white" style={{ background: cols[grade] ?? "#0F2A44" }}>
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-2">
          Composite safety score
        </div>
        <div className="flex items-baseline gap-4 mb-3">
          <div className="text-5xl font-bold tabular-nums">{r.score as number}</div>
          <div className="text-3xl font-bold opacity-80">grade {grade}</div>
        </div>
      </div>
    );
  }

  if (calc.slug === "fire-load-calculator" && typeof r.fireLoadMJPerM2 === "number") {
    const cls = r.classification as string;
    const cols: Record<string, string> = {
      low: "#10B981",
      moderate: "#F59E0B",
      high: "#F97316",
      veryHigh: "#DC2626",
    };
    return (
      <div className="p-6 rounded-2xl text-white" style={{ background: cols[cls] ?? "#0F2A44" }}>
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-2">
          Fire load density · {cls.toUpperCase()}
        </div>
        <div className="text-5xl font-bold tabular-nums">
          {r.fireLoadMJPerM2 as number}{" "}
          <span className="text-sm font-normal opacity-70">MJ/m²</span>
        </div>
      </div>
    );
  }

  if (calc.slug === "evacuation-time-calculator" && typeof r.rsetMinutes === "number") {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0D3356] text-white">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#00C897] mb-2">
          RSET — Required Safe Egress Time
        </div>
        <div className="text-5xl font-bold tabular-nums mb-4">
          {r.rsetMinutes as number} <span className="text-sm font-normal opacity-70">min</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MiniCard label="Pre-movement" value={`${r.preMovementS as number}s`} />
          <MiniCard label="Travel" value={`${r.travelS as number}s`} />
          <MiniCard label="Flow through exits" value={`${r.flowS as number}s`} />
        </div>
      </div>
    );
  }

  if (calc.slug === "noise-dose-calculator" && typeof r.dose === "number") {
    const permissibleExceeded = r.permissibleExceeded as boolean;
    const actionExceeded = r.actionLevelExceeded as boolean;
    const color = permissibleExceeded ? "#DC2626" : actionExceeded ? "#F59E0B" : "#10B981";
    return (
      <div className="p-6 rounded-2xl text-white" style={{ background: color }}>
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-2">
          Daily noise dose · OSHA 29 CFR 1910.95
        </div>
        <div className="flex items-baseline gap-3 mb-3">
          <div className="text-5xl font-bold tabular-nums">{r.dose as number}%</div>
          <div className="text-xs opacity-80">of PEL</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MiniCard label="8-hour TWA" value={`${r.twa8h as number} dB(A)`} />
          <MiniCard label="Exchange rate" value={`${r.exchangeRate as number} dB`} />
        </div>
      </div>
    );
  }

  if (calc.slug === "stress-risk-calculator" && typeof r.averageScore === "number") {
    const rating = r.rating as string;
    const cols: Record<string, string> = {
      poor: "#DC2626",
      needsImprovement: "#F59E0B",
      good: "#84CC16",
      excellent: "#10B981",
    };
    return (
      <div className="p-6 rounded-2xl text-white" style={{ background: cols[rating] ?? "#0F2A44" }}>
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-2">
          Work-related stress · HSE UK Management Standards
        </div>
        <div className="flex items-baseline gap-3 mb-3">
          <div className="text-5xl font-bold tabular-nums">{r.averageScore as number}</div>
          <div className="text-sm opacity-80">/5.0 · {rating}</div>
        </div>
      </div>
    );
  }

  if (calc.slug === "manual-handling-calculator" && typeof r.score === "number") {
    const color = r.color as string;
    const cols = { green: "#10B981", amber: "#F59E0B", red: "#DC2626" };
    return (
      <div
        className="p-6 rounded-2xl text-white"
        style={{ background: cols[color as keyof typeof cols] }}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-2">
          HSE UK MAC tool · {color.toUpperCase()}
        </div>
        <div className="text-5xl font-bold tabular-nums mb-2">{r.score as number}</div>
        <div className="text-sm">{r.action as string}</div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0D3356] text-white">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[#00C897] mb-3">
        {calc.name} result
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(r)
          .filter(([k]) => typeof (r as Record<string, unknown>)[k] !== "object")
          .slice(0, 6)
          .map(([k, v]) => (
            <MiniCard key={k} label={k} value={String(v)} />
          ))}
      </div>
    </div>
  );
}

function MiniCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
      <div className="text-[10px] uppercase tracking-widest font-mono opacity-70 mb-1">{label}</div>
      <div className="text-xl font-bold tabular-nums leading-tight">{value}</div>
      {hint && <div className="text-[10px] opacity-60 mt-1">{hint}</div>}
    </div>
  );
}

function getPrimaryValue(result: unknown): number | null {
  if (!result || typeof result !== "object") return null;
  const r = result as Record<string, unknown>;
  if (typeof r.rate === "number") return r.rate;
  if (typeof r.value === "number") return r.value;
  if (typeof r.wbgt === "number") return r.wbgt;
  if (typeof r.score === "number") return r.score;
  if (typeof r.li === "number") return r.li;
  if (typeof r.emr === "number") return r.emr;
  if (typeof r.dose === "number") return r.dose;
  if (typeof r.averageScore === "number") return r.averageScore;
  if (typeof r.total === "number") return r.total;
  return null;
}
