// Workload & productivity calculators.

// Total manhours across a crew with optional overtime
export function calculateManhours(args: {
  workers: number;
  hoursPerDay: number;
  days: number;
  overtimePct?: number; // percent of regular hours worked as overtime
  overtimeMultiplier?: number; // default 1 (counts same as regular for exposure purposes)
}): {
  regular: number;
  overtime: number;
  total: number;
  exposureHours: number; // for HSE rate calculations — always sum of regular + overtime
} {
  const regular = args.workers * args.hoursPerDay * args.days;
  const otPct = (args.overtimePct ?? 0) / 100;
  const overtime = Math.round(regular * otPct);
  const total = regular + overtime;
  return {
    regular,
    overtime,
    total,
    exposureHours: total,
  };
}

// FTE — Full-time equivalent workers
export function calculateFTE(args: {
  totalAnnualHours: number;
  standardFTEHours?: number; // default 2000 (OSHA baseline: 100 FTE × 40hr × 50wk = 200k)
}): { fte: number } {
  const base = args.standardFTEHours ?? 2000;
  return { fte: Number((args.totalAnnualHours / base).toFixed(1)) };
}
