// Shared types for all calculators.

export type RiskBand = "low" | "medium" | "high" | "extreme";
export type IncidentBase = "osha" | "iso";

export interface RateResult {
  rate: number;
  base: number;
  formula: string;
}

export interface BandedResult<T extends string = RiskBand> {
  score: number;
  band: T;
  recommendation: string;
}

export interface ExposureResult {
  value: number;
  unit: string;
  actionLevelExceeded: boolean;
  limitExceeded: boolean;
  regulation: string;
}

export interface CalculatorMeta {
  slug: string;
  name: string;
  category:
    | "incident-rates"
    | "exposure"
    | "ergonomics"
    | "environmental"
    | "fire"
    | "workload"
    | "risk"
    | "cost";
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  formula: string;
  regulation: string;
  regulationUrl?: string;
  inputs: CalculatorInput[];
  tags?: string[];
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: "number" | "select";
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string;
  options?: Array<{ value: string; label: string }>;
  help?: string;
}
