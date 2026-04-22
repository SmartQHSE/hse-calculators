// Ergonomics calculators: REBA, RULA, NIOSH lifting, manual handling.

// NIOSH Lifting Equation (1994) — Recommended Weight Limit + Lifting Index
export function calculateNIOSHLift(args: {
  horizontalCm: number; // H: horizontal distance from ankles to hands
  verticalCm: number; // V: vertical distance of hands from floor at origin
  verticalTravelCm: number; // D: vertical travel distance
  angleDegrees: number; // A: asymmetry angle
  frequencyPerMin: number; // F: lifts per minute
  durationHours: number; // hours of continuous lifting
  couplingQuality: "good" | "fair" | "poor"; // C
  loadKg: number; // actual load
}): {
  rwl: number; // Recommended Weight Limit (kg)
  li: number; // Lifting Index = load / RWL
  risk: "acceptable" | "increased" | "high";
} {
  const LC = 23; // load constant, kg
  const HM = args.horizontalCm > 0 ? Math.min(1, 25 / args.horizontalCm) : 0;
  const VM = 1 - 0.003 * Math.abs(args.verticalCm - 75);
  const DM = args.verticalTravelCm >= 25 ? 0.82 + 4.5 / args.verticalTravelCm : 1;
  const AM = 1 - 0.0032 * args.angleDegrees;

  // Frequency multiplier — NIOSH table lookup (simplified approximation)
  let FM = 1;
  const f = args.frequencyPerMin;
  const longDuration = args.durationHours > 2;
  if (f <= 0.2) FM = longDuration ? 0.85 : 1;
  else if (f <= 0.5) FM = longDuration ? 0.81 : 0.97;
  else if (f <= 1) FM = longDuration ? 0.75 : 0.94;
  else if (f <= 2) FM = longDuration ? 0.65 : 0.91;
  else if (f <= 4) FM = longDuration ? 0.45 : 0.84;
  else if (f <= 6) FM = longDuration ? 0.27 : 0.75;
  else if (f <= 8) FM = longDuration ? 0.18 : 0.6;
  else FM = 0.0;

  const CM =
    args.couplingQuality === "good" ? 1 : args.couplingQuality === "fair" ? 0.95 : 0.9;

  const rwl = LC * HM * VM * DM * AM * FM * CM;
  const li = rwl > 0 ? args.loadKg / rwl : 999;
  let risk: "acceptable" | "increased" | "high";
  if (li <= 1) risk = "acceptable";
  else if (li <= 3) risk = "increased";
  else risk = "high";
  return { rwl: Number(rwl.toFixed(1)), li: Number(li.toFixed(2)), risk };
}

// REBA — Rapid Entire Body Assessment (Hignett & McAtamney 2000)
// Simplified scoring: combines posture scores into a final 1-15 action level.
export function calculateREBA(args: {
  neck: 1 | 2 | 3;
  trunk: 1 | 2 | 3 | 4 | 5;
  legs: 1 | 2 | 3 | 4;
  upperArm: 1 | 2 | 3 | 4 | 5 | 6;
  lowerArm: 1 | 2;
  wrist: 1 | 2 | 3;
  load?: "light" | "medium" | "heavy" | "shock"; // <5kg / 5-10kg / >10kg / shock
  coupling?: "good" | "fair" | "poor" | "unacceptable";
  activity?: "static" | "repeated" | "rapid"; // any that apply
}): { score: number; risk: "negligible" | "low" | "medium" | "high" | "veryHigh"; action: string } {
  // Group A = neck/trunk/legs; Group B = upperArm/lowerArm/wrist.
  const groupA = args.neck + args.trunk + args.legs;
  const groupB = args.upperArm + args.lowerArm + args.wrist;
  let loadScore = 0;
  if (args.load === "medium") loadScore = 1;
  else if (args.load === "heavy") loadScore = 2;
  else if (args.load === "shock") loadScore = 3;
  let couplingScore = 0;
  if (args.coupling === "fair") couplingScore = 1;
  else if (args.coupling === "poor") couplingScore = 2;
  else if (args.coupling === "unacceptable") couplingScore = 3;
  const scoreA = groupA + loadScore;
  const scoreB = groupB + couplingScore;
  const combined = scoreA + scoreB;
  let activityScore = 0;
  if (args.activity === "static") activityScore += 1;
  if (args.activity === "repeated") activityScore += 1;
  if (args.activity === "rapid") activityScore += 1;
  const finalScore = Math.min(15, combined + activityScore);
  let risk: "negligible" | "low" | "medium" | "high" | "veryHigh";
  let action: string;
  if (finalScore <= 1) {
    risk = "negligible";
    action = "No action required";
  } else if (finalScore <= 3) {
    risk = "low";
    action = "Change may be needed";
  } else if (finalScore <= 7) {
    risk = "medium";
    action = "Further investigation and change required";
  } else if (finalScore <= 10) {
    risk = "high";
    action = "Investigate and implement change";
  } else {
    risk = "veryHigh";
    action = "Implement change immediately";
  }
  return { score: finalScore, risk, action };
}

// RULA — Rapid Upper Limb Assessment (McAtamney & Corlett 1993)
export function calculateRULA(args: {
  upperArm: 1 | 2 | 3 | 4;
  lowerArm: 1 | 2;
  wrist: 1 | 2 | 3 | 4;
  wristTwist: 1 | 2;
  neck: 1 | 2 | 3 | 4;
  trunk: 1 | 2 | 3 | 4;
  legs: 1 | 2;
  muscleUseA?: boolean; // held static >1min or repeated >4/min
  muscleUseB?: boolean;
  forceA?: 0 | 1 | 2 | 3; // 0: <2kg intermittent, 1: 2-10kg intermittent, 2: 2-10kg static/repeat, 3: >10kg
  forceB?: 0 | 1 | 2 | 3;
}): { score: number; actionLevel: 1 | 2 | 3 | 4; action: string } {
  const groupA =
    args.upperArm + args.lowerArm + args.wrist + args.wristTwist +
    (args.muscleUseA ? 1 : 0) + (args.forceA ?? 0);
  const groupB =
    args.neck + args.trunk + args.legs +
    (args.muscleUseB ? 1 : 0) + (args.forceB ?? 0);
  const score = Math.min(7, groupA + groupB - 4); // simplified combination
  let actionLevel: 1 | 2 | 3 | 4;
  let action: string;
  if (score <= 2) {
    actionLevel = 1;
    action = "Acceptable posture";
  } else if (score <= 4) {
    actionLevel = 2;
    action = "Further investigation, changes may be needed";
  } else if (score <= 6) {
    actionLevel = 3;
    action = "Investigation and changes required soon";
  } else {
    actionLevel = 4;
    action = "Investigation and changes required immediately";
  }
  return { score, actionLevel, action };
}

// Manual Handling — HSE UK MAC (Manual Assessment Charts) simplified banding
export function calculateManualHandling(args: {
  loadKg: number;
  distanceM: number; // carry distance
  frequencyPerHour: number;
  twisted?: boolean;
  awkwardPosture?: boolean;
  twoPerson?: boolean;
}): { color: "green" | "amber" | "red"; score: number; action: string } {
  let score = 0;
  // Load weight scoring (approximate MAC tool)
  if (args.loadKg < 7) score += 0;
  else if (args.loadKg < 15) score += 2;
  else if (args.loadKg < 25) score += 4;
  else if (args.loadKg < 35) score += 6;
  else score += 10;
  if (args.distanceM > 10) score += 2;
  if (args.frequencyPerHour > 10) score += 2;
  if (args.frequencyPerHour > 30) score += 2;
  if (args.twisted) score += 2;
  if (args.awkwardPosture) score += 2;
  if (args.twoPerson) score = Math.max(0, score - 3);
  const color: "green" | "amber" | "red" =
    score <= 4 ? "green" : score <= 9 ? "amber" : "red";
  const action =
    color === "green"
      ? "Low risk — no action"
      : color === "amber"
        ? "Moderate risk — reduce exposure"
        : "High risk — redesign task or provide mechanical aid";
  return { color, score, action };
}
