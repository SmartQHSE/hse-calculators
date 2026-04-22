import { describe, it, expect } from "vitest";
import {
  calculateTRIR,
  calculateLTIR,
  calculateLTIFR,
  calculateDART,
  calculateSeverityRate,
  calculateFrequencyRate,
  calculateEMR,
  calculateIncidentCost,
  calculateHeinrichRatio,
  calculateSafeDays,
} from "../incident-rates";

describe("TRIR (OSHA)", () => {
  it("matches the canonical OSHA example", () => {
    // 3 recordables over 500,000 hours → (3 × 200,000) / 500,000 = 1.2
    expect(calculateTRIR({ recordableIncidents: 3, hoursWorked: 500_000 }).rate).toBe(1.2);
  });
  it("handles zero incidents", () => {
    expect(calculateTRIR({ recordableIncidents: 0, hoursWorked: 500_000 }).rate).toBe(0);
  });
  it("returns zero when hours are zero (avoids NaN)", () => {
    expect(calculateTRIR({ recordableIncidents: 1, hoursWorked: 0 }).rate).toBe(0);
  });
});

describe("LTIR (OSHA)", () => {
  it("uses the 200,000 base", () => {
    expect(calculateLTIR({ lostTimeIncidents: 2, hoursWorked: 500_000 })).toMatchObject({
      rate: 0.8,
      base: 200_000,
    });
  });
});

describe("LTIFR (ISO/ILO)", () => {
  it("uses the 1,000,000 base", () => {
    expect(calculateLTIFR({ lostTimeInjuries: 3, hoursWorked: 500_000 })).toMatchObject({
      rate: 6,
      base: 1_000_000,
    });
  });
});

describe("DART (OSHA)", () => {
  it("matches DART textbook example", () => {
    expect(calculateDART({ dartCases: 2, hoursWorked: 500_000 }).rate).toBe(0.8);
  });
});

describe("Severity Rate", () => {
  it("defaults to OSHA base", () => {
    expect(calculateSeverityRate({ daysLost: 10, hoursWorked: 500_000 }).base).toBe(200_000);
  });
  it("uses ISO base when requested", () => {
    const r = calculateSeverityRate({ daysLost: 45, hoursWorked: 500_000, base: "iso" });
    expect(r.base).toBe(1_000_000);
    expect(r.rate).toBe(90);
  });
});

describe("Frequency Rate", () => {
  it("uses 1M base (international)", () => {
    expect(
      calculateFrequencyRate({ accidents: 5, hoursWorked: 2_000_000 }).rate,
    ).toBe(2.5);
  });
});

describe("EMR", () => {
  it("returns 1.0 when actual = expected", () => {
    expect(calculateEMR({ actualLosses: 100_000, expectedLosses: 100_000 }).emr).toBe(1);
  });
  it("bands excellent below 0.75", () => {
    expect(calculateEMR({ actualLosses: 50_000, expectedLosses: 100_000 }).band).toBe("excellent");
  });
  it("bands poor above 1.05", () => {
    expect(calculateEMR({ actualLosses: 120_000, expectedLosses: 100_000 }).band).toBe("poor");
  });
});

describe("Incident Cost", () => {
  it("applies first-aid indirect ratio of 4.5x", () => {
    const r = calculateIncidentCost({ directCost: 1000, severity: "firstAid" });
    expect(r.direct).toBe(1000);
    expect(r.indirect).toBe(4500);
    expect(r.total).toBe(5500);
  });
  it("computes revenue needed at 10% margin default", () => {
    const r = calculateIncidentCost({ directCost: 10_000, severity: "medical" });
    expect(r.revenueNeeded).toBe(r.total * 10);
  });
});

describe("Heinrich Ratio", () => {
  it("projects 29 minor and 300 near-miss per serious (Heinrich model)", () => {
    const r = calculateHeinrichRatio({
      seriousInjuries: 1,
      minorInjuries: 29,
      nearMisses: 300,
      model: "heinrich",
    });
    expect(r.onTargetMinor).toBe(29);
    expect(r.onTargetNearMiss).toBe(300);
    expect(r.reportingGap).toBe("good");
  });
  it("flags poor near-miss reporting when ratio very low", () => {
    const r = calculateHeinrichRatio({
      seriousInjuries: 2,
      minorInjuries: 58,
      nearMisses: 10,
    });
    expect(r.reportingGap).toBe("poor");
  });
});

describe("Safe Days", () => {
  it("counts elapsed days between two dates", () => {
    const r = calculateSafeDays({
      lastIncidentDate: "2026-01-01",
      asOfDate: "2026-04-01",
    });
    expect(r.days).toBeGreaterThanOrEqual(89);
    expect(r.days).toBeLessThanOrEqual(91);
  });
});
