// Fire safety calculators: fire load, evacuation time, extinguisher sizing.

// Fire Load Density — NFPA 557 / BS 9999 / Eurocode EN 1991-1-2
// FL = Σ (Mass × Calorific Value) / Floor Area  →  MJ/m²
const CALORIFIC_VALUES_MJ_PER_KG: Record<string, number> = {
  wood: 18,
  paper: 16,
  plastic: 35,
  cardboard: 15,
  textile: 20,
  rubber: 32,
  furniture: 20, // mixed
  petroleum: 44,
  naturalGas: 50,
  chemicals: 25, // average
};
export function calculateFireLoad(args: {
  items: Array<{ materialKg: number; material: keyof typeof CALORIFIC_VALUES_MJ_PER_KG }>;
  floorAreaM2: number;
}): {
  fireLoadMJPerM2: number;
  classification: "low" | "moderate" | "high" | "veryHigh";
  regulation: string;
} {
  const totalMJ = args.items.reduce(
    (s, i) => s + i.materialKg * (CALORIFIC_VALUES_MJ_PER_KG[i.material] ?? 20),
    0,
  );
  const density = args.floorAreaM2 > 0 ? totalMJ / args.floorAreaM2 : 0;
  let classification: "low" | "moderate" | "high" | "veryHigh";
  if (density < 800) classification = "low";
  else if (density < 1600) classification = "moderate";
  else if (density < 3200) classification = "high";
  else classification = "veryHigh";
  return {
    fireLoadMJPerM2: Number(density.toFixed(1)),
    classification,
    regulation: "NFPA 557 / BS 9999 / EN 1991-1-2",
  };
}

// Evacuation Time — RSET (Required Safe Egress Time) per NFPA 101 / BS 9999
// RSET = pre-movement time + travel time + flow time through exits
// Travel time = distance / walking speed
// Flow time = occupants / (exit width × flow rate)
export function calculateEvacuationTime(args: {
  occupants: number;
  travelDistanceM: number;
  walkingSpeedMS?: number; // default 1.2 m/s on flat surface (SFPE)
  exitWidthM: number; // total effective exit width
  flowRatePersonsPerMPerS?: number; // default 1.3 per m per second (SFPE)
  preMovementTimeS?: number; // notification + decision, default 60s
}): {
  preMovementS: number;
  travelS: number;
  flowS: number;
  rsetS: number;
  rsetMinutes: number;
  regulation: string;
} {
  const walkingSpeed = args.walkingSpeedMS ?? 1.2;
  const flowRate = args.flowRatePersonsPerMPerS ?? 1.3;
  const pre = args.preMovementTimeS ?? 60;
  const travel = args.travelDistanceM / walkingSpeed;
  const flow = args.exitWidthM > 0 && flowRate > 0
    ? args.occupants / (args.exitWidthM * flowRate)
    : Infinity;
  const rset = pre + travel + flow;
  return {
    preMovementS: Number(pre.toFixed(0)),
    travelS: Number(travel.toFixed(0)),
    flowS: Number(flow.toFixed(0)),
    rsetS: Number(rset.toFixed(0)),
    rsetMinutes: Number((rset / 60).toFixed(1)),
    regulation: "NFPA 101 / BS 9999 / SFPE Handbook",
  };
}

// Fire Extinguisher Sizing — NFPA 10 for Class A hazards
// Required UL rating depends on hazard classification and floor area covered
export function calculateFireExtinguisherSize(args: {
  floorAreaM2: number;
  hazardClass: "light" | "ordinary" | "extra"; // NFPA 10 occupancy hazards
}): {
  minimumRating: string; // e.g. "2-A"
  travelDistanceLimitM: number;
  countRecommendation: number;
  regulation: string;
} {
  // NFPA 10 Table 6.2.1.1 — maximum floor area per A-unit
  const areaPerA: Record<string, number> = {
    light: 278, // m² per rating unit
    ordinary: 139,
    extra: 93,
  };
  const travelDistance = 23; // 75 ft = ~23m max travel distance (NFPA 10)
  const requiredA = Math.ceil(args.floorAreaM2 / (areaPerA[args.hazardClass] ?? 139));
  const rating = `${Math.max(2, requiredA)}-A`;
  const countRec = Math.max(1, Math.ceil(args.floorAreaM2 / (areaPerA[args.hazardClass] ?? 139)));
  return {
    minimumRating: rating,
    travelDistanceLimitM: travelDistance,
    countRecommendation: countRec,
    regulation: "NFPA 10 / BS 5306-8",
  };
}
