"use client";

import { useMemo, useState } from "react";
import type { CalculatorMeta } from "@/core/types";
import * as core from "@/core";

// Maps calculator slug → core function to call. The registry field names are
// the function input keys, so we just spread the form state into the function.
const DISPATCH: Record<string, (input: Record<string, number | string>) => unknown> = {
  "trir-calculator": (i) =>
    core.calculateTRIR({ recordableIncidents: Number(i.recordableIncidents), hoursWorked: Number(i.hoursWorked) }),
  "ltir-calculator": (i) =>
    core.calculateLTIR({ lostTimeIncidents: Number(i.lostTimeIncidents), hoursWorked: Number(i.hoursWorked) }),
  "ltifr-calculator": (i) =>
    core.calculateLTIFR({ lostTimeInjuries: Number(i.lostTimeInjuries), hoursWorked: Number(i.hoursWorked) }),
  "dart-rate-calculator": (i) =>
    core.calculateDART({ dartCases: Number(i.dartCases), hoursWorked: Number(i.hoursWorked) }),
  "severity-rate-calculator": (i) =>
    core.calculateSeverityRate({
      daysLost: Number(i.daysLost),
      hoursWorked: Number(i.hoursWorked),
      base: i.base as "osha" | "iso",
    }),
  "frequency-rate-calculator": (i) =>
    core.calculateFrequencyRate({ accidents: Number(i.accidents), hoursWorked: Number(i.hoursWorked) }),
  "emr-calculator": (i) =>
    core.calculateEMR({ actualLosses: Number(i.actualLosses), expectedLosses: Number(i.expectedLosses) }),
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

export default function CalculatorForm({ calc }: { calc: CalculatorMeta }) {
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

  return (
    <div>
      <div className="space-y-4">
        {calc.inputs.map((input) => (
          <div key={input.id}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
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
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00C897] focus:outline-none"
              />
            ) : (
              <select
                value={String(values[input.id] ?? "")}
                onChange={(e) => setValues({ ...values, [input.id]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00C897] focus:outline-none"
              >
                {input.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
            {input.help && <p className="text-xs text-slate-500 mt-1">{input.help}</p>}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">Result</div>
        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
          {result == null ? "—" : JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}
