// Occupational exposure calculators: noise, vibration, chemical, heat.
// All regulation-cited, all pure functions.

import type { ExposureResult } from "./types";

// Noise Dose (OSHA 29 CFR 1910.95) — 5 dB exchange rate
// European (EU 2003/10/EC) and ACGIH use 3 dB exchange rate
export function calculateNoiseDose(args: {
  leq: number; // equivalent continuous sound level, dB(A)
  hours: number; // exposure duration
  exchangeRate?: 3 | 5; // 5 = OSHA, 3 = ACGIH/EU
}): {
  dose: number; // percent of PEL
  twa8h: number; // 8-hour time-weighted average dB(A)
  actionLevelExceeded: boolean; // 85 dB(A) 8hr TWA
  permissibleExceeded: boolean; // 90 dB(A) 8hr TWA (OSHA PEL)
  exchangeRate: number;
} {
  const q = args.exchangeRate ?? 5;
  const criterion = 90; // OSHA PEL
  // Per OSHA Appendix A: T = 8 / 2^((L-90)/Q)
  const permissibleHours = 8 / Math.pow(2, (args.leq - criterion) / q);
  const dose = (args.hours / permissibleHours) * 100;
  // TWA = criterion + q * log2(hours / permissibleHours)  [OSHA eqn A-1]
  const twa8h =
    args.hours > 0 && permissibleHours > 0
      ? criterion + q * Math.log2(args.hours / permissibleHours)
      : 0;
  return {
    dose: Number(dose.toFixed(1)),
    twa8h: Number(twa8h.toFixed(1)),
    actionLevelExceeded: twa8h >= 85,
    permissibleExceeded: twa8h >= 90,
    exchangeRate: q,
  };
}

// Noise Exposure — time-weighted across multiple segments
export function calculateNoiseExposure(args: {
  segments: Array<{ leq: number; hours: number }>;
  exchangeRate?: 3 | 5;
}): {
  twa8h: number;
  dose: number;
  actionLevelExceeded: boolean;
  permissibleExceeded: boolean;
} {
  const q = args.exchangeRate ?? 5;
  const criterion = 90;
  let totalDose = 0;
  for (const seg of args.segments) {
    const permissibleHours = 8 / Math.pow(2, (seg.leq - criterion) / q);
    totalDose += seg.hours / permissibleHours;
  }
  const dose = totalDose * 100;
  const twa8h = criterion + q * Math.log2(totalDose);
  return {
    twa8h: Number(twa8h.toFixed(1)),
    dose: Number(dose.toFixed(1)),
    actionLevelExceeded: twa8h >= 85,
    permissibleExceeded: twa8h >= 90,
  };
}

// Hand-Arm Vibration A(8) — HSE UK L140 / ISO 5349-1
// A(8) = a × sqrt(T / 8)   where a = vibration magnitude in m/s², T = exposure hours
export function calculateHAV(args: {
  vibrationMs2: number;
  exposureHours: number;
}): ExposureResult & { eav: number; elv: number; partialDoseMs2h: number } {
  const eav = 2.5; // Exposure Action Value (m/s²)
  const elv = 5.0; // Exposure Limit Value (m/s²)
  const a8 = args.vibrationMs2 * Math.sqrt(args.exposureHours / 8);
  return {
    value: Number(a8.toFixed(2)),
    unit: "m/s² A(8)",
    actionLevelExceeded: a8 >= eav,
    limitExceeded: a8 >= elv,
    regulation: "HSE UK L140 / ISO 5349-1 / EU 2002/44/EC",
    eav,
    elv,
    partialDoseMs2h: Number((args.vibrationMs2 ** 2 * args.exposureHours).toFixed(2)),
  };
}

// Whole-Body Vibration A(8) — ISO 2631-1 / EU 2002/44/EC
export function calculateWBV(args: {
  vibrationMs2: number;
  exposureHours: number;
  axis?: "x" | "y" | "z";
}): ExposureResult & { eav: number; elv: number } {
  const eav = 0.5; // m/s²
  const elv = 1.15; // m/s²
  // For Z axis use k=1.0; for X/Y use k=1.4 (weighting factor)
  const k = args.axis === "z" ? 1.0 : 1.4;
  const a8 = k * args.vibrationMs2 * Math.sqrt(args.exposureHours / 8);
  return {
    value: Number(a8.toFixed(3)),
    unit: "m/s² A(8)",
    actionLevelExceeded: a8 >= eav,
    limitExceeded: a8 >= elv,
    regulation: "ISO 2631-1 / EU 2002/44/EC",
    eav,
    elv,
  };
}

// Chemical Exposure TWA — 8hr time-weighted average for a single substance
export function calculateChemicalExposure(args: {
  segments: Array<{ concentration: number; hours: number }>;
  pel: number; // Permissible Exposure Limit or WEL
  stel?: number; // Short-Term Exposure Limit (15-min)
  unit?: "ppm" | "mg/m³";
}): {
  twa8h: number;
  pctOfPEL: number;
  pelExceeded: boolean;
  unit: string;
  regulation: string;
} {
  const totalHours = args.segments.reduce((s, x) => s + x.hours, 0) || 8;
  const weighted = args.segments.reduce(
    (s, x) => s + x.concentration * x.hours,
    0,
  );
  const twa8h = weighted / 8;
  const pctOfPEL = args.pel > 0 ? (twa8h / args.pel) * 100 : 0;
  return {
    twa8h: Number(twa8h.toFixed(3)),
    pctOfPEL: Number(pctOfPEL.toFixed(1)),
    pelExceeded: twa8h > args.pel,
    unit: args.unit ?? "ppm",
    regulation: "OSHA PEL 29 CFR 1910.1000 / ACGIH TLV / HSE UK EH40",
  };
}

// COSHH Exposure (HSE UK EH40 — WEL = Workplace Exposure Limit)
export const calculateCOSHHExposure = calculateChemicalExposure;

// COSHH Risk Score — HSE UK COSHH Essentials qualitative banding
export function calculateCOSHHRiskScore(args: {
  hazardGroup: "A" | "B" | "C" | "D" | "E"; // R-phrase banding
  quantityScale: "small" | "medium" | "large"; // <1kg / 1-100kg / >100kg
  volatility: "low" | "medium" | "high"; // BP >150 / 50-150 / <50 °C
}): {
  controlApproach: 1 | 2 | 3 | 4;
  description: string;
} {
  // Simplified COSHH Essentials lookup matrix.
  const hazardRank = { A: 1, B: 2, C: 3, D: 4, E: 4 }[args.hazardGroup];
  const scaleRank = { small: 1, medium: 2, large: 3 }[args.quantityScale];
  const volRank = { low: 1, medium: 2, high: 3 }[args.volatility];
  const compositeRank = Math.max(hazardRank, Math.min(4, scaleRank + volRank - 1));
  const approach = Math.min(4, Math.max(1, compositeRank)) as 1 | 2 | 3 | 4;
  const descriptions: Record<1 | 2 | 3 | 4, string> = {
    1: "Approach 1: General ventilation",
    2: "Approach 2: Engineering controls (LEV)",
    3: "Approach 3: Containment / enclosure",
    4: "Approach 4: Specialist advice required",
  };
  return { controlApproach: approach, description: descriptions[approach] };
}
