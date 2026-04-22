// Environmental calculators: heat stress, ventilation, lighting, carbon.

// WBGT — Wet Bulb Globe Temperature (ACGIH TLV / ISO 7243)
// Outdoor (solar): WBGT = 0.7·Tw + 0.2·Tg + 0.1·Td
// Indoor (no sun): WBGT = 0.7·Tw + 0.3·Tg
export function calculateWBGT(args: {
  tempC: number; // dry bulb
  humidity: number; // % RH
  globeTempC?: number; // black globe temperature
  indoor?: boolean;
}): {
  wbgt: number;
  riskLevel: "low" | "moderate" | "high" | "extreme";
  acgihWorkRestRatio: string; // e.g. "75/25" for moderate workload
  regulation: string;
} {
  // Stull (2011) approximation for natural wet bulb from T and RH:
  // Tw ≈ T · atan(0.151977·sqrt(RH+8.313659)) + atan(T+RH) - atan(RH−1.676331) + 0.00391838·RH^1.5·atan(0.023101·RH) − 4.686035
  const t = args.tempC;
  const rh = args.humidity;
  const tw =
    t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
    Math.atan(t + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035;
  const tg = args.globeTempC ?? t + 5; // rough default: globe ≈ dry bulb + 5°C in sun
  const wbgt = args.indoor
    ? 0.7 * tw + 0.3 * tg
    : 0.7 * tw + 0.2 * tg + 0.1 * t;

  // ACGIH TLV thresholds for moderate workload, acclimatised worker
  let riskLevel: "low" | "moderate" | "high" | "extreme";
  let ratio: string;
  if (wbgt < 27.5) {
    riskLevel = "low";
    ratio = "Continuous work";
  } else if (wbgt < 29.5) {
    riskLevel = "moderate";
    ratio = "75/25";
  } else if (wbgt < 31.5) {
    riskLevel = "high";
    ratio = "50/50";
  } else if (wbgt < 32.5) {
    riskLevel = "high";
    ratio = "25/75";
  } else {
    riskLevel = "extreme";
    ratio = "Stop work";
  }
  return {
    wbgt: Number(wbgt.toFixed(1)),
    riskLevel,
    acgihWorkRestRatio: ratio,
    regulation: "ACGIH TLV / ISO 7243 / NIOSH Heat Stress Criteria",
  };
}

// Heat Index — NWS "feels like" temperature (Rothfusz regression)
export function calculateHeatIndex(args: {
  tempC: number;
  humidity: number;
}): { heatIndexC: number; caution: "none" | "caution" | "extreme-caution" | "danger" | "extreme-danger" } {
  const F = (args.tempC * 9) / 5 + 32;
  const R = args.humidity;
  let HI: number;
  if (F < 80) {
    HI = 0.5 * (F + 61 + (F - 68) * 1.2 + R * 0.094);
  } else {
    HI =
      -42.379 +
      2.04901523 * F +
      10.14333127 * R -
      0.22475541 * F * R -
      0.00683783 * F * F -
      0.05481717 * R * R +
      0.00122874 * F * F * R +
      0.00085282 * F * R * R -
      0.00000199 * F * F * R * R;
    if (R < 13 && F >= 80 && F <= 112) {
      HI -= ((13 - R) / 4) * Math.sqrt((17 - Math.abs(F - 95)) / 17);
    } else if (R > 85 && F >= 80 && F <= 87) {
      HI += ((R - 85) / 10) * ((87 - F) / 5);
    }
  }
  const hiC = Number((((HI - 32) * 5) / 9).toFixed(1));
  let caution: "none" | "caution" | "extreme-caution" | "danger" | "extreme-danger";
  if (HI < 80) caution = "none";
  else if (HI < 90) caution = "caution";
  else if (HI < 103) caution = "extreme-caution";
  else if (HI < 125) caution = "danger";
  else caution = "extreme-danger";
  return { heatIndexC: hiC, caution };
}

// Lux level — workplace illuminance requirement (CIBSE / EN 12464-1)
const TASK_LUX_REQUIREMENTS: Record<string, number> = {
  "circulation/storage": 150,
  warehouse: 200,
  "occasional-reading": 300,
  office: 500,
  "drawing/inspection": 750,
  "precision-assembly": 1000,
  "fine-work/laboratory": 1500,
  "very-fine/jewelry": 2000,
};
export function calculateLuxLevel(args: {
  task: keyof typeof TASK_LUX_REQUIREMENTS;
  measuredLux?: number;
}): { requiredLux: number; compliant: boolean | null; gap: number | null } {
  const required = TASK_LUX_REQUIREMENTS[args.task] ?? 500;
  if (args.measuredLux == null) {
    return { requiredLux: required, compliant: null, gap: null };
  }
  return {
    requiredLux: required,
    compliant: args.measuredLux >= required,
    gap: args.measuredLux - required,
  };
}

// Ventilation rate — ASHRAE 62.1 for general office
export function calculateVentilation(args: {
  roomVolumeM3: number; // total room volume
  occupancy: number;
  roomType?: "office" | "classroom" | "meeting" | "laboratory" | "industrial" | "warehouse";
}): {
  requiredCFM: number;
  requiredLps: number;
  ach: number;
  unit: string;
  regulation: string;
} {
  // Per-person + per-area ventilation rates (cfm)
  const rates: Record<string, { perPerson: number; perArea: number }> = {
    office: { perPerson: 5, perArea: 0.06 },
    classroom: { perPerson: 10, perArea: 0.12 },
    meeting: { perPerson: 5, perArea: 0.06 },
    laboratory: { perPerson: 10, perArea: 0.18 },
    industrial: { perPerson: 10, perArea: 0.18 },
    warehouse: { perPerson: 5, perArea: 0.06 },
  };
  const r = rates[args.roomType ?? "office"]!;
  const floorAreaM2 = args.roomVolumeM3 / 2.7; // assume 2.7m ceiling
  const requiredCFM = r.perPerson * args.occupancy + r.perArea * floorAreaM2 * 10.764;
  const requiredLps = requiredCFM * 0.4719; // cfm → L/s
  const volumeFt3 = args.roomVolumeM3 * 35.3147;
  const ach = (requiredCFM * 60) / volumeFt3;
  return {
    requiredCFM: Number(requiredCFM.toFixed(1)),
    requiredLps: Number(requiredLps.toFixed(1)),
    ach: Number(ach.toFixed(2)),
    unit: "cfm",
    regulation: "ASHRAE 62.1 / CIBSE",
  };
}

// Carbon footprint — GHG Protocol Scope 1/2/3 (kg CO₂e)
const EMISSION_FACTORS = {
  // Scope 1 — direct emissions
  dieselLitre: 2.68,
  petrolLitre: 2.31,
  naturalGasM3: 2.03,
  lpgLitre: 1.51,
  // Scope 2 — purchased energy (grid average, varies by region)
  electricityKwhWorld: 0.475,
  electricityKwhUAE: 0.411,
  electricityKwhKSA: 0.725,
  electricityKwhUK: 0.233,
  electricityKwhUSA: 0.383,
  // Scope 3 — common categories
  flightKmShort: 0.255,
  flightKmLong: 0.195,
  carKm: 0.171,
  wasteKgLandfill: 0.586,
};
export function calculateCarbonFootprint(args: {
  scope1?: { dieselL?: number; petrolL?: number; naturalGasM3?: number; lpgL?: number };
  scope2?: { electricityKwh?: number; region?: "world" | "uae" | "ksa" | "uk" | "usa" };
  scope3?: { flightKmShort?: number; flightKmLong?: number; carKm?: number; wasteKgLandfill?: number };
}): {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  unit: "kg CO₂e";
  regulation: string;
} {
  const s1 = args.scope1 ?? {};
  const s2 = args.scope2 ?? {};
  const s3 = args.scope3 ?? {};

  const scope1 =
    (s1.dieselL ?? 0) * EMISSION_FACTORS.dieselLitre +
    (s1.petrolL ?? 0) * EMISSION_FACTORS.petrolLitre +
    (s1.naturalGasM3 ?? 0) * EMISSION_FACTORS.naturalGasM3 +
    (s1.lpgL ?? 0) * EMISSION_FACTORS.lpgLitre;

  const regionKey = {
    world: EMISSION_FACTORS.electricityKwhWorld,
    uae: EMISSION_FACTORS.electricityKwhUAE,
    ksa: EMISSION_FACTORS.electricityKwhKSA,
    uk: EMISSION_FACTORS.electricityKwhUK,
    usa: EMISSION_FACTORS.electricityKwhUSA,
  };
  const scope2 =
    (s2.electricityKwh ?? 0) * (regionKey[s2.region ?? "world"] ?? regionKey.world);

  const scope3 =
    (s3.flightKmShort ?? 0) * EMISSION_FACTORS.flightKmShort +
    (s3.flightKmLong ?? 0) * EMISSION_FACTORS.flightKmLong +
    (s3.carKm ?? 0) * EMISSION_FACTORS.carKm +
    (s3.wasteKgLandfill ?? 0) * EMISSION_FACTORS.wasteKgLandfill;

  return {
    scope1: Number(scope1.toFixed(2)),
    scope2: Number(scope2.toFixed(2)),
    scope3: Number(scope3.toFixed(2)),
    total: Number((scope1 + scope2 + scope3).toFixed(2)),
    unit: "kg CO₂e",
    regulation: "GHG Protocol / ISO 14064-1",
  };
}
