// Incident-rate calculators. All formulas sourced from cited regulations.
// All functions are pure — no side effects, no I/O, no dependencies.

import type { IncidentBase, RateResult } from "./types";

const OSHA_BASE = 200_000; // 100 FTE × 40 hr/wk × 50 wk/yr
const ISO_BASE = 1_000_000; // ILO / ISO 45001:2018 standard

function rate(count: number, hoursWorked: number, base: number): number {
  if (hoursWorked <= 0) return 0;
  return Number(((count * base) / hoursWorked).toFixed(3));
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

// TRIR — Total Recordable Incident Rate (OSHA 29 CFR 1904.7)
export function calculateTRIR(args: {
  recordableIncidents: number;
  hoursWorked: number;
}): RateResult {
  const r = rate(args.recordableIncidents, args.hoursWorked, OSHA_BASE);
  return {
    rate: r,
    base: OSHA_BASE,
    formula: `(${args.recordableIncidents} × ${fmt(OSHA_BASE)}) ÷ ${fmt(args.hoursWorked)}`,
  };
}

// LTIR — Lost Time Incident Rate (OSHA 29 CFR 1904.7(b)(3))
export function calculateLTIR(args: {
  lostTimeIncidents: number;
  hoursWorked: number;
}): RateResult {
  const r = rate(args.lostTimeIncidents, args.hoursWorked, OSHA_BASE);
  return {
    rate: r,
    base: OSHA_BASE,
    formula: `(${args.lostTimeIncidents} × ${fmt(OSHA_BASE)}) ÷ ${fmt(args.hoursWorked)}`,
  };
}

// LTIFR — Lost Time Injury Frequency Rate (ILO / ISO 45001:2018)
export function calculateLTIFR(args: {
  lostTimeInjuries: number;
  hoursWorked: number;
}): RateResult {
  const r = rate(args.lostTimeInjuries, args.hoursWorked, ISO_BASE);
  return {
    rate: r,
    base: ISO_BASE,
    formula: `(${args.lostTimeInjuries} × ${fmt(ISO_BASE)}) ÷ ${fmt(args.hoursWorked)}`,
  };
}

// DART — Days Away, Restricted, Transferred (OSHA 29 CFR 1904.7(a))
export function calculateDART(args: { dartCases: number; hoursWorked: number }): RateResult {
  const r = rate(args.dartCases, args.hoursWorked, OSHA_BASE);
  return {
    rate: r,
    base: OSHA_BASE,
    formula: `(${args.dartCases} × ${fmt(OSHA_BASE)}) ÷ ${fmt(args.hoursWorked)}`,
  };
}

// Severity Rate (OSHA default 200k base, ILO 1M base)
export function calculateSeverityRate(args: {
  daysLost: number;
  hoursWorked: number;
  base?: IncidentBase;
}): RateResult {
  const base = args.base === "iso" ? ISO_BASE : OSHA_BASE;
  const r = rate(args.daysLost, args.hoursWorked, base);
  return {
    rate: r,
    base,
    formula: `(${args.daysLost} × ${fmt(base)}) ÷ ${fmt(args.hoursWorked)}`,
  };
}

// Frequency Rate (HSE UK / IOGP — international standard, 1M base)
export function calculateFrequencyRate(args: {
  accidents: number;
  hoursWorked: number;
}): RateResult {
  const r = rate(args.accidents, args.hoursWorked, ISO_BASE);
  return {
    rate: r,
    base: ISO_BASE,
    formula: `(${args.accidents} × ${fmt(ISO_BASE)}) ÷ ${fmt(args.hoursWorked)}`,
  };
}

// EMR — Experience Modification Rate (NCCI workers comp)
export function calculateEMR(args: {
  actualLosses: number;
  expectedLosses: number;
}): { emr: number; savingsVsBaseline: string; band: "excellent" | "good" | "neutral" | "poor" } {
  if (args.expectedLosses <= 0) {
    return { emr: 1, savingsVsBaseline: "0%", band: "neutral" };
  }
  const emr = Number((args.actualLosses / args.expectedLosses).toFixed(2));
  const delta = 1 - emr;
  const savingsVsBaseline = `${(delta * 100).toFixed(1)}%`;
  let band: "excellent" | "good" | "neutral" | "poor";
  if (emr <= 0.75) band = "excellent";
  else if (emr <= 0.95) band = "good";
  else if (emr <= 1.05) band = "neutral";
  else band = "poor";
  return { emr, savingsVsBaseline, band };
}

// Incident Cost — OSHA $afety Pays model
const INDIRECT_COST_RATIOS: Record<string, number> = {
  firstAid: 4.5,
  medical: 1.1,
  restricted: 1.1,
  lostTime: 1.0,
  fatality: 0.6, // indirect relative to direct drops for high-direct-cost incidents
};
export function calculateIncidentCost(args: {
  directCost: number;
  severity: "firstAid" | "medical" | "restricted" | "lostTime" | "fatality";
  profitMarginPct?: number;
}): {
  direct: number;
  indirect: number;
  total: number;
  revenueNeeded: number;
} {
  const ratio = INDIRECT_COST_RATIOS[args.severity] ?? 1.1;
  const direct = args.directCost;
  const indirect = Math.round(direct * ratio);
  const total = direct + indirect;
  const margin = (args.profitMarginPct ?? 10) / 100;
  const revenueNeeded = margin > 0 ? Math.round(total / margin) : total;
  return { direct, indirect, total, revenueNeeded };
}

// Heinrich Ratio — near-miss pyramid (1:29:300 classical, 1:10:30:600 Bird)
export function calculateHeinrichRatio(args: {
  seriousInjuries: number;
  minorInjuries: number;
  nearMisses: number;
  model?: "heinrich" | "bird";
}): {
  model: string;
  ratio: string;
  onTargetMinor: number;
  onTargetNearMiss: number;
  reportingGap: "good" | "moderate" | "poor";
} {
  const model = args.model === "bird" ? "bird" : "heinrich";
  const expectedMinorPerSerious = model === "bird" ? 10 : 29;
  const expectedNearMissPerSerious = model === "bird" ? 30 : 300;
  const onTargetMinor = args.seriousInjuries * expectedMinorPerSerious;
  const onTargetNearMiss = args.seriousInjuries * expectedNearMissPerSerious;
  const nearMissReportingRatio =
    onTargetNearMiss > 0 ? args.nearMisses / onTargetNearMiss : 1;
  let reportingGap: "good" | "moderate" | "poor";
  if (nearMissReportingRatio >= 0.8) reportingGap = "good";
  else if (nearMissReportingRatio >= 0.4) reportingGap = "moderate";
  else reportingGap = "poor";
  return {
    model,
    ratio:
      model === "bird"
        ? "1 : 10 : 30 : 600 (Bird)"
        : "1 : 29 : 300 (Heinrich)",
    onTargetMinor,
    onTargetNearMiss,
    reportingGap,
  };
}

// Safe Days since last recordable
export function calculateSafeDays(args: {
  lastIncidentDate: string | Date;
  asOfDate?: string | Date;
}): { days: number; weeks: number; months: number; years: number } {
  const last = new Date(args.lastIncidentDate).getTime();
  const now = new Date(args.asOfDate ?? Date.now()).getTime();
  const days = Math.max(0, Math.floor((now - last) / (1000 * 60 * 60 * 24)));
  return {
    days,
    weeks: Math.floor(days / 7),
    months: Math.floor(days / 30.44),
    years: Number((days / 365.25).toFixed(2)),
  };
}

// Working Days Lost (ISO 45001 Clause 9.1 monitoring)
export function calculateWorkingDaysLost(args: {
  incidents: Array<{ daysAway: number; daysRestricted?: number }>;
  restrictedMultiplier?: number;
}): { totalLost: number; fullDayEquivalents: number } {
  const restrMult = args.restrictedMultiplier ?? 0.5;
  let total = 0;
  let fde = 0;
  for (const i of args.incidents) {
    total += i.daysAway + (i.daysRestricted ?? 0);
    fde += i.daysAway + (i.daysRestricted ?? 0) * restrMult;
  }
  return { totalLost: total, fullDayEquivalents: Number(fde.toFixed(1)) };
}
