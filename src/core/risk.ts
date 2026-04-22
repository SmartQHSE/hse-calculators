// Risk-scoring calculators: matrix, reduction, safety score, stress risk.

import type { RiskBand } from "./types";

// 5×5 or 4×4 risk matrix scoring
export function calculateRiskMatrix(args: {
  likelihood: number; // 1 to size
  severity: number; // 1 to size
  matrix?: "4x4" | "5x5";
}): {
  score: number;
  band: RiskBand;
  color: string;
  action: string;
  matrix: string;
} {
  const size = args.matrix === "4x4" ? 4 : 5;
  const L = Math.max(1, Math.min(size, args.likelihood));
  const S = Math.max(1, Math.min(size, args.severity));
  const score = L * S;

  // Standard oil-and-gas / Aramco / ADNOC 5×5 banding
  let band: RiskBand;
  let color: string;
  let action: string;
  if (size === 5) {
    if (score <= 4) {
      band = "low";
      color = "#10B981";
      action = "Acceptable — monitor";
    } else if (score <= 9) {
      band = "medium";
      color = "#F59E0B";
      action = "Manageable — implement controls";
    } else if (score <= 16) {
      band = "high";
      color = "#F97316";
      action = "Substantial — reduce risk ALARP";
    } else {
      band = "extreme";
      color = "#DC2626";
      action = "Intolerable — stop work, escalate to leadership";
    }
  } else {
    if (score <= 3) {
      band = "low";
      color = "#10B981";
      action = "Acceptable";
    } else if (score <= 6) {
      band = "medium";
      color = "#F59E0B";
      action = "Reduce ALARP";
    } else if (score <= 9) {
      band = "high";
      color = "#F97316";
      action = "High — escalate";
    } else {
      band = "extreme";
      color = "#DC2626";
      action = "Stop work";
    }
  }
  return { score, band, color, action, matrix: `${size}×${size}` };
}

// Risk Reduction — pre-control vs post-control percentage reduction
export function calculateRiskReduction(args: {
  preScore: number;
  postScore: number;
}): {
  reductionPct: number;
  effective: boolean;
} {
  if (args.preScore <= 0) return { reductionPct: 0, effective: false };
  const reduction = ((args.preScore - args.postScore) / args.preScore) * 100;
  return {
    reductionPct: Number(reduction.toFixed(1)),
    effective: reduction >= 50,
  };
}

// Composite Safety Score — weighted KPI (0-100)
export function calculateSafetyScore(args: {
  trir?: number; // lower is better (target <1)
  ltifrTarget?: number;
  ltifr?: number; // lower is better
  nearMissReporting?: number; // ratio to recordables, higher is better (target 10+)
  trainingComplete?: number; // percentage (0-100)
  auditCompliance?: number; // percentage (0-100)
}): {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  components: Record<string, number>;
} {
  const components: Record<string, number> = {};
  let weights = 0;
  let total = 0;
  // TRIR — world class <1, good <3, poor >5
  if (args.trir != null) {
    const s = Math.max(0, 100 - args.trir * 20);
    components.trir = Number(s.toFixed(0));
    total += s * 25;
    weights += 25;
  }
  // LTIFR
  if (args.ltifr != null) {
    const target = args.ltifrTarget ?? 1;
    const s = Math.max(0, 100 - Math.max(0, args.ltifr - target) * 20);
    components.ltifr = Number(s.toFixed(0));
    total += s * 20;
    weights += 20;
  }
  // Near-miss reporting
  if (args.nearMissReporting != null) {
    const s = Math.min(100, (args.nearMissReporting / 10) * 100);
    components.nearMissReporting = Number(s.toFixed(0));
    total += s * 20;
    weights += 20;
  }
  // Training
  if (args.trainingComplete != null) {
    components.trainingComplete = args.trainingComplete;
    total += args.trainingComplete * 20;
    weights += 20;
  }
  // Audit compliance
  if (args.auditCompliance != null) {
    components.auditCompliance = args.auditCompliance;
    total += args.auditCompliance * 15;
    weights += 15;
  }
  const score = weights > 0 ? total / weights : 0;
  let grade: "A" | "B" | "C" | "D" | "F";
  if (score >= 90) grade = "A";
  else if (score >= 80) grade = "B";
  else if (score >= 70) grade = "C";
  else if (score >= 60) grade = "D";
  else grade = "F";
  return { score: Number(score.toFixed(1)), grade, components };
}

// Work-related Stress Risk — HSE UK Management Standards
export function calculateStressRisk(args: {
  demands: number; // 1-5 worker rating (1 = very poor, 5 = very good)
  control: number;
  support: number;
  relationships: number;
  role: number;
  change: number;
}): {
  averageScore: number;
  rating: "poor" | "needsImprovement" | "good" | "excellent";
  priorityAreas: string[];
  regulation: string;
} {
  const scores = [
    ["demands", args.demands],
    ["control", args.control],
    ["support", args.support],
    ["relationships", args.relationships],
    ["role", args.role],
    ["change", args.change],
  ] as const;
  const avg = scores.reduce((s, [, v]) => s + v, 0) / scores.length;
  const priorityAreas = scores.filter(([, v]) => v < 3).map(([k]) => k);
  let rating: "poor" | "needsImprovement" | "good" | "excellent";
  if (avg < 2.5) rating = "poor";
  else if (avg < 3.5) rating = "needsImprovement";
  else if (avg < 4.5) rating = "good";
  else rating = "excellent";
  return {
    averageScore: Number(avg.toFixed(2)),
    rating,
    priorityAreas,
    regulation: "HSE UK Management Standards",
  };
}
