# HSE Calculators — Free Open-Source Safety Metrics Library

> **30+ health, safety & environment (HSE) calculators** — TRIR, LTIR, LTIFR, DART, EMR, severity rate, heat stress (WBGT), noise exposure, hand-arm vibration, ergonomics (REBA, RULA, NIOSH), fire load, evacuation time, manhours, risk matrix, incident cost, and more. Pure TypeScript, zero runtime dependencies, MIT licensed.

[![npm version](https://img.shields.io/npm/v/@smartqhse/hse-calculators.svg)](https://www.npmjs.com/package/@smartqhse/hse-calculators)
[![npm downloads](https://img.shields.io/npm/dm/@smartqhse/hse-calculators.svg)](https://www.npmjs.com/package/@smartqhse/hse-calculators)
[![license](https://img.shields.io/npm/l/@smartqhse/hse-calculators.svg)](./LICENSE)
[![tests](https://github.com/SmartQHSE/hse-calculators/actions/workflows/test.yml/badge.svg)](https://github.com/SmartQHSE/hse-calculators/actions/workflows/test.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Live demo](https://img.shields.io/badge/demo-tools.smartqhse.com-00C897.svg)](https://tools.smartqhse.com)

The most comprehensive **open-source occupational health and safety (OHS) metrics library** available. Every formula references the exact regulation (OSHA 29 CFR, HSE UK, ISO 45001, ILO, NIOSH, ACGIH) it is sourced from. Used by construction, oil & gas, manufacturing, utilities, mining, and industrial teams worldwide.

🌐 **Live calculators:** [tools.smartqhse.com](https://tools.smartqhse.com) — no signup, no ads, free forever.
🏗️ **Full HSE platform:** [smartqhse.com](https://www.smartqhse.com) — AI-powered permits, risk assessments, incidents, audits, ISO 45001 compliance.

---

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Available calculators](#available-calculators)
- [Incident rate formulas](#incident-rate-formulas)
- [Occupational exposure](#occupational-exposure)
- [Ergonomics](#ergonomics)
- [Environmental](#environmental)
- [Fire safety](#fire-safety)
- [Workload & productivity](#workload--productivity)
- [Risk scoring](#risk-scoring)
- [Regulation citations](#regulation-citations)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
npm install @smartqhse/hse-calculators
# or
pnpm add @smartqhse/hse-calculators
# or
yarn add @smartqhse/hse-calculators
```

**Zero runtime dependencies.** Tree-shakeable. Node 18+, works in the browser, Deno, Bun, edge runtimes.

## Quick start

```typescript
import { calculateTRIR, calculateLTIFR, calculateWBGT } from "@smartqhse/hse-calculators";

// TRIR — OSHA Total Recordable Incident Rate (29 CFR 1904.7)
const trir = calculateTRIR({ recordableIncidents: 3, hoursWorked: 500_000 });
// → { rate: 1.2, base: 200_000, formula: "(3 × 200,000) ÷ 500,000" }

// LTIFR — ISO/ILO Lost Time Injury Frequency Rate
const ltifr = calculateLTIFR({ lostTimeInjuries: 3, hoursWorked: 500_000 });
// → { rate: 6, base: 1_000_000, formula: "(3 × 1,000,000) ÷ 500,000" }

// WBGT — Heat stress (ACGIH TLV)
const heat = calculateWBGT({ tempC: 38, humidity: 60, globeTempC: 42 });
// → { wbgt: 34.1, riskLevel: "high", acgihWorkRestRatio: "25/75" }
```

---

## Available calculators

### Incident rate formulas

The "four big ratios" every HSE manager tracks. All return rate + base + formula string so you can audit the calculation.

| Function | Measures | Base | Regulation |
|---|---|---|---|
| [`calculateTRIR`](#calculatetrir) | **Total Recordable Incident Rate** (OSHA) | 200,000 | 29 CFR 1904.7 |
| [`calculateLTIR`](#calculateltir) | **Lost Time Incident Rate** (OSHA) | 200,000 | 29 CFR 1904.7(b)(3) |
| [`calculateLTIFR`](#calculateltifr) | **Lost Time Injury Frequency Rate** (ISO/ILO) | 1,000,000 | ILO / ISO 45001:2018 |
| [`calculateDART`](#calculatedart) | **Days Away, Restricted, Transferred** | 200,000 | 29 CFR 1904.7(a) |
| [`calculateSeverityRate`](#calculateseverityrate) | Days lost per 200k/1M hours | 200,000 or 1,000,000 | OSHA / ILO |
| [`calculateFrequencyRate`](#calculatefrequencyrate) | Accident frequency (international) | 1,000,000 | HSE UK / IOGP |
| [`calculateEMR`](#calculateemr) | **Experience Modification Rate** (workers comp) | — | NCCI |
| [`calculateIncidentCost`](#calculateincidentcost) | Direct + indirect cost per incident | — | OSHA $afety Pays |
| [`calculateHeinrichRatio`](#calculateheinrichratio) | Near-miss pyramid ratios | — | Heinrich/Bird |
| [`calculateSafeDays`](#calculatesafedays) | Days since last recordable | — | — |
| [`calculateWorkingDaysLost`](#calculateworkingdayslost) | Total productive days lost | — | ISO 45001 |

### Occupational exposure

| Function | Measures | Units | Regulation |
|---|---|---|---|
| [`calculateNoiseDose`](#calculatenoisedose) | Daily noise dose (LEX,8h) | dB(A) | OSHA 29 CFR 1910.95 |
| [`calculateNoiseExposure`](#calculatenoiseexposure) | Time-weighted noise exposure | dB(A) | ACGIH TLV / EU 2003/10/EC |
| [`calculateHAV`](#calculatehav) | Hand-Arm Vibration dose | A(8) m/s² | HSE UK L140 |
| [`calculateWBV`](#calculatewbv) | Whole-Body Vibration dose | A(8) m/s² | ISO 2631-1 |
| [`calculateChemicalExposure`](#calculatechemicalexposure) | TWA chemical exposure | mg/m³ | OSHA PEL / ACGIH TLV |
| [`calculateCOSHHExposure`](#calculatecoshhexposure) | COSHH workplace exposure | WEL | HSE UK EH40 |
| [`calculateCOSHHRiskScore`](#calculatecoshhriskscore) | COSHH risk banding | 1–4 | HSE UK COSHH Essentials |

### Ergonomics

| Function | Measures | Scale | Source |
|---|---|---|---|
| [`calculateREBA`](#calculatereba) | **Rapid Entire Body Assessment** | 1–15 | Hignett & McAtamney 2000 |
| [`calculateRULA`](#calculaterula) | **Rapid Upper Limb Assessment** | 1–7 | McAtamney & Corlett 1993 |
| [`calculateNIOSHLift`](#calculatenioshlift) | **NIOSH Lifting Equation** | RWL kg | NIOSH 94-110 |
| [`calculateManualHandling`](#calculatemanualhandling) | UK MAC manual handling risk | Green/Amber/Red | HSE UK MAC tool |

### Environmental

| Function | Measures | Regulation |
|---|---|---|
| [`calculateWBGT`](#calculatewbgt) | **Wet Bulb Globe Temperature** (heat stress) | ACGIH TLV / ISO 7243 |
| [`calculateHeatIndex`](#calculateheatindex) | NWS heat index (feels-like temp) | NWS / OSHA campaign |
| [`calculateLuxLevel`](#calculateluxlevel) | Required workplace illuminance | CIBSE / EN 12464-1 |
| [`calculateVentilation`](#calculateventilation) | Required ventilation rate (ACH) | ASHRAE 62.1 |
| [`calculateCarbonFootprint`](#calculatecarbonfootprint) | Scope 1+2+3 CO₂e | GHG Protocol |

### Fire safety

| Function | Measures | Source |
|---|---|---|
| [`calculateFireLoad`](#calculatefireload) | Fire load density (MJ/m²) | NFPA 557 / BS 9999 |
| [`calculateEvacuationTime`](#calculateevacuationtime) | Required Safe Egress Time (RSET) | NFPA 101 / BS 9999 |
| [`calculateFireExtinguisherSize`](#calculatefireextinguishersize) | Minimum extinguisher rating | NFPA 10 / BS 5306 |

### Workload & productivity

| Function | Measures |
|---|---|
| [`calculateManhours`](#calculatemanhours) | Total exposure hours across shifts |
| [`calculateFTE`](#calculatefte) | Full-time equivalent workers |

### Risk scoring

| Function | Measures | Output |
|---|---|---|
| [`calculateRiskMatrix`](#calculateriskmatrix) | 5×5 or 4×4 risk matrix | score + L/M/H/E band |
| [`calculateRiskReduction`](#calculateriskreduction) | Pre-control vs post-control residual | % reduction |
| [`calculateSafetyScore`](#calculatesafetyscore) | Composite safety performance KPI | 0-100 |
| [`calculateStressRisk`](#calculatestressrisk) | HSE UK Stress Management Standards | 1-5 |

---

## Incident rate formulas

### `calculateTRIR`

OSHA **Total Recordable Incident Rate** — the single most requested HSE metric in the US. Required for OSHA 300A annual summary submission (29 CFR 1904) and used in insurance Experience Modification Rate (EMR) calculations.

```typescript
calculateTRIR({ recordableIncidents: 3, hoursWorked: 500_000 });
// → { rate: 1.2, base: 200_000, formula: "(3 × 200,000) ÷ 500,000" }
```

**Formula:** `TRIR = (Recordable Incidents × 200,000) ÷ Total Hours Worked`

The 200,000-hour base represents 100 full-time equivalent workers × 40 hours/week × 50 weeks/year. A TRIR below **3.0** is considered good; below **1.0** is world-class.

### `calculateLTIR`

OSHA **Lost Time Incident Rate** — counts only cases where the worker lost one or more full days away from work. A subset of TRIR.

```typescript
calculateLTIR({ lostTimeIncidents: 2, hoursWorked: 500_000 });
// → { rate: 0.8, base: 200_000, formula: "(2 × 200,000) ÷ 500,000" }
```

**Formula:** `LTIR = (Lost Time Incidents × 200,000) ÷ Total Hours Worked`

### `calculateLTIFR`

ISO/ILO **Lost Time Injury Frequency Rate** — international (non-US) standard. Uses 1,000,000-hour base. Required by **ISO 45001:2018** for management review.

```typescript
calculateLTIFR({ lostTimeInjuries: 3, hoursWorked: 500_000 });
// → { rate: 6, base: 1_000_000, formula: "(3 × 1,000,000) ÷ 500,000" }
```

**Formula:** `LTIFR = (Lost Time Injuries × 1,000,000) ÷ Total Hours Worked`

Used by HSE UK, IOGP, GCC countries (UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain), and most global safety frameworks.

### `calculateDART`

OSHA **Days Away, Restricted, Transferred** rate. Used in BLS SOII benchmarking and OSHA VPP (Voluntary Protection Programs) evaluation.

```typescript
calculateDART({ dartCases: 2, hoursWorked: 500_000 });
// → { rate: 0.8, base: 200_000, formula: "(2 × 200,000) ÷ 500,000" }
```

**Formula:** `DART = (DART Cases × 200,000) ÷ Total Hours Worked`

### `calculateSeverityRate`

Severity rate — days lost per exposure base. Both OSHA (200k) and ILO (1M) bases supported.

```typescript
calculateSeverityRate({ daysLost: 45, hoursWorked: 500_000, base: "iso" });
// → { rate: 90, base: 1_000_000 }
```

### `calculateFrequencyRate`

International accident frequency rate — used by HSE UK, IOGP, ADNOC, Aramco, QatarEnergy.

```typescript
calculateFrequencyRate({ accidents: 5, hoursWorked: 2_000_000 });
// → { rate: 2.5, base: 1_000_000 }
```

### `calculateEMR`

**Experience Modification Rate** — multiplier applied to workers' compensation insurance premiums. An EMR of **1.0** is industry baseline; **below 1.0** saves money; **above 1.0** costs more.

```typescript
calculateEMR({ actualLosses: 150_000, expectedLosses: 200_000 });
// → { emr: 0.75, savingsVsBaseline: "25%" }
```

### `calculateIncidentCost`

Direct + indirect cost model based on **OSHA $afety Pays** tool. Indirect costs (investigation, lost productivity, training replacement) typically run **1.1× to 4.5×** the direct cost depending on injury severity.

```typescript
calculateIncidentCost({ directCost: 10_000, severity: "medical" });
// → { direct: 10_000, indirect: 11_000, total: 21_000, revenueNeeded: 210_000 }
```

Revenue-needed is calculated at a default 10% profit margin — the sales revenue required to cover the incident cost.

---

## Occupational exposure

### `calculateWBGT`

**Wet Bulb Globe Temperature** — the gold standard heat stress metric. Returns WBGT in °C plus ACGIH TLV-based work/rest ratio recommendations.

```typescript
calculateWBGT({ tempC: 38, humidity: 60, globeTempC: 42, indoor: false });
// → { wbgt: 34.1, riskLevel: "high", acgihWorkRestRatio: "25/75" }
```

**Formulas:**
- Outdoor (with sun): `WBGT = 0.7·Tw + 0.2·Tg + 0.1·Td`
- Indoor (no sun): `WBGT = 0.7·Tw + 0.3·Tg`

Where `Tw` = natural wet bulb, `Tg` = globe temperature, `Td` = dry bulb. Critical in GCC summers, Australian mining, African construction.

### `calculateNoiseDose`

OSHA 8-hour noise dose per **29 CFR 1910.95**. Exchange rate: 5 dB (OSHA) or 3 dB (ACGIH / EU 2003/10/EC).

```typescript
calculateNoiseDose({ leq: 92, hours: 8, exchangeRate: 5 });
// → { dose: 200, twa8h: 92, actionLevelExceeded: true, permissibleExceeded: false }
```

### `calculateHAV`

**Hand-Arm Vibration** daily exposure A(8) per **HSE UK L140**. Action value: 2.5 m/s²; exposure limit: 5.0 m/s².

```typescript
calculateHAV({ vibrationMs2: 4.2, exposureHours: 3 });
// → { a8: 2.57, actionExceeded: true, limitExceeded: false }
```

### `calculateWBV`

**Whole-Body Vibration** per ISO 2631-1 / EU 2002/44/EC. Critical for haulage, excavator operation, forklift drivers.

---

## Ergonomics

### `calculateREBA`

**Rapid Entire Body Assessment** — Hignett & McAtamney 2000. Full-body ergonomic risk scoring for manual handling, construction, healthcare.

```typescript
calculateREBA({
  neck: 2, trunk: 3, legs: 1,
  upperArm: 3, lowerArm: 2, wrist: 2,
  load: "medium", coupling: "fair", activity: "repeated"
});
// → { score: 7, risk: "medium", action: "further investigation required" }
```

### `calculateRULA`

**Rapid Upper Limb Assessment** — McAtamney & Corlett 1993. Focus on neck, trunk, upper limbs for office, assembly, inspection work.

### `calculateNIOSHLift`

**NIOSH Lifting Equation** (1994 revision). Calculates Recommended Weight Limit (RWL) and Lifting Index (LI) for manual lifting tasks.

---

## Environmental

### `calculateLuxLevel`

Required workplace illuminance per **CIBSE** and **EN 12464-1**. Office: 500 lx. Warehouse: 200 lx. Precision assembly: 1000 lx.

### `calculateVentilation`

Required ventilation rate in air changes per hour (ACH) per **ASHRAE 62.1**.

### `calculateCarbonFootprint`

Scope 1 (direct emissions) + Scope 2 (purchased energy) + Scope 3 (value chain) CO₂-equivalent in kg, per **GHG Protocol** and **ISO 14064-1**.

---

## Fire safety

### `calculateFireLoad`

Fire load density (MJ/m²) per **NFPA 557** and **BS 9999**. Classifies as low (<800), moderate (<1,600), high (<3,200), very high (>3,200).

### `calculateEvacuationTime`

**Required Safe Egress Time (RSET)** per **NFPA 101** and **BS 9999**. Combines pre-movement time + travel time + flow time through exits.

### `calculateFireExtinguisherSize`

Minimum extinguisher rating based on hazard class and floor area per **NFPA 10** and **BS 5306**.

---

## Workload & productivity

### `calculateManhours`

Total exposure hours across multiple shifts, with support for overtime multipliers.

```typescript
calculateManhours({ workers: 150, hoursPerDay: 10, days: 22, overtimePct: 15 });
// → { regular: 33_000, overtime: 4_950, total: 37_950 }
```

### `calculateWorkingDaysLost`

Total productive days lost to injuries — required KPI for **ISO 45001:2018 Clause 9.1** monitoring.

---

## Risk scoring

### `calculateRiskMatrix`

5×5 or 4×4 risk matrix scoring. Common in oil & gas (Aramco SAIC-SS, ADNOC, QatarEnergy), construction, and ISO 45001 risk registers.

```typescript
calculateRiskMatrix({ likelihood: 4, severity: 5, matrix: "5x5" });
// → { score: 20, band: "extreme", color: "#DC2626", action: "stop work, elevate to leadership" }
```

---

## Regulation citations

Every formula in this library is rooted in a published regulation or peer-reviewed ergonomic standard. No proprietary calculations, no "SmartQHSE recommends" values.

**United States**
- 29 CFR 1904.7 — OSHA recordability (TRIR, LTIR, DART)
- 29 CFR 1910.95 — OSHA occupational noise exposure
- NIOSH Publication 94-110 — Revised lifting equation
- NFPA 10, 101, 557 — Fire codes
- ASHRAE 62.1 — Ventilation
- NCCI — Workers comp EMR

**United Kingdom**
- HSE L140 — Hand-arm vibration
- HSE EH40 — Workplace exposure limits
- HSE MAC tool — Manual handling assessment charts
- BS 5306, BS 9999 — Fire safety
- HSE Stress Management Standards
- RIDDOR (Reporting of Injuries, Diseases and Dangerous Occurrences Regulations) 2013

**International**
- ISO 45001:2018 — OH&S management systems
- ISO 14001:2015 — Environmental management systems
- ISO 14064-1 — GHG quantification
- ISO 2631-1 — Whole-body vibration
- ISO 7243 — WBGT heat stress
- ILO — International Labour Organization frequency rate standards

**Europe**
- EU Directive 2003/10/EC — Noise
- EU Directive 2002/44/EC — Vibration
- EN 12464-1 — Workplace lighting

**Professional bodies**
- ACGIH TLVs® — Threshold Limit Values
- GHG Protocol — Scope 1/2/3 accounting
- IOGP — International Association of Oil & Gas Producers
- NIOSH — National Institute for Occupational Safety and Health

---

## Who uses this library?

- **EHS / HSE managers** running monthly KPI dashboards
- **Construction project safety teams** calculating TRIR for Aramco / ADNOC / QatarEnergy / Procore prequalification
- **ISO 45001 consultants** generating compliant metric outputs for Clause 9.1 monitoring
- **Occupational hygienists** quantifying noise, vibration, chemical, and heat exposure
- **Ergonomists** documenting REBA, RULA, NIOSH assessments
- **Insurance brokers** estimating EMR impact of incident reduction programs
- **Safety software vendors** embedding calculation engines into their products
- **Universities** teaching occupational health and safety courses
- **Governments** publishing national HSE benchmarks

---

## Need the full platform?

[SmartQHSE](https://www.smartqhse.com) is the **AI-powered HSE / QHSE management platform** built on top of these calculators.

| Feature | This library | SmartQHSE platform |
|---|---|---|
| 30+ HSE calculators | ✅ | ✅ (+ UI) |
| AI-generated risk assessments | ❌ | ✅ (ARIA) |
| AI-generated method statements, JSAs, toolbox talks | ❌ | ✅ |
| Permit-to-Work (PTW) workflow with signatures | ❌ | ✅ |
| Incident Management + RCA | ❌ | ✅ |
| Contractor prequalification | ❌ | ✅ |
| ISO 45001 / 14001 / 9001 compliance dashboards | ❌ | ✅ |
| Real-time KPI tracking against these calculators | ❌ | ✅ |
| Regional compliance (OSHAD, Aramco, QatarEnergy, SABIC) | ❌ | ✅ |
| Arabic bilingual | ❌ | ✅ |

**Start free:** [smartqhse.com](https://www.smartqhse.com) · **Pricing:** from $49/mo · **Demo:** [smartqhse.com/how-it-works](https://www.smartqhse.com/how-it-works)

---

## Contributing

We welcome contributions — new calculators, improved formulas, additional regulation citations, translations. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT © SmartQHSE Ltd — see [LICENSE](./LICENSE).

If you use these calculators in production software, a backlink to [smartqhse.com](https://www.smartqhse.com) is appreciated but not required.

---

## Related resources

- **SmartQHSE Safety Blog** — [smartqhse.com/safety-blog](https://www.smartqhse.com/safety-blog) (244+ articles on OSHA, ISO 45001, HSE best practices)
- **HSE Glossary** — [smartqhse.com/hse-glossary](https://www.smartqhse.com/hse-glossary)
- **Regulations index** — [smartqhse.com/regulations](https://www.smartqhse.com/regulations)
- **ISO 45001 implementation guide** — [smartqhse.com/iso-45001-implementation-guide](https://www.smartqhse.com/iso-45001-implementation-guide)
- **Best HSE software 2026** — [smartqhse.com/best-hse-software-2026](https://www.smartqhse.com/best-hse-software-2026)

## Keywords

HSE calculator, EHS calculator, TRIR calculator, LTIR calculator, LTIFR calculator, DART rate calculator, OSHA incident rate calculator, RIDDOR calculator, severity rate calculator, frequency rate calculator, EMR calculator, experience modification rate, WBGT calculator, heat stress calculator, noise exposure calculator, hand arm vibration calculator, HAV calculator, whole body vibration, REBA calculator, RULA calculator, NIOSH lifting equation, manual handling calculator, ergonomics calculator, fire load calculator, evacuation time calculator, manhours calculator, risk matrix calculator, 5x5 risk matrix, ISO 45001 calculator, OSHA 300A calculator, safety metrics, HSE metrics, EHS metrics, occupational health and safety, workplace safety software, HSE software, QHSE software, AI safety software, construction safety software, oil and gas safety, Aramco HSE, ADNOC HSE, OSHAD compliance, GCC HSE, Middle East HSE, Saudi Arabia safety, UAE safety.
