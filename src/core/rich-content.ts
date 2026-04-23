// Rich per-calculator content — intro, FAQs, citations, examples, related.
// Used to render authority-building landing pages around each calculator.
// Separate from the core registry so core stays dependency-free for npm
// consumers, while the web app consumes both.

import type { CalculatorMeta } from "./types";

export interface BenchmarkRow {
  industry: string;
  value: number;
  label?: string;
}

export interface FAQEntry {
  q: string;
  a: string;
}

export interface WorkedExample {
  title: string;
  narrative: string;
}

export interface CitationEntry {
  title: string;
  url: string;
}

export interface RichContent {
  /** 2-3 paragraph intro with keyword-rich description. */
  intro: string;
  /** Bullet list of roles/industries that use this calculator. */
  whoUses: string[];
  /** Step-by-step "how to use it" (3-6 steps). */
  howToUse: string[];
  /** 5-10 worked examples. */
  examples: WorkedExample[];
  /** Common mistakes when using this metric. */
  commonMistakes: string[];
  /** Regulatory/peer-reviewed citations. */
  citations: CitationEntry[];
  /** 5-10 FAQ entries — rendered with FAQPage schema. */
  faqs: FAQEntry[];
  /** Slugs of related calculators. */
  relatedCalcs: string[];
  /** Industry benchmark rows to render as comparison bars. */
  benchmarks?: {
    unit: string;
    source: string;
    sourceUrl: string;
    rows: BenchmarkRow[];
    /** Good / average / poor thresholds for the rating bar. */
    thresholds?: { good: number; average: number };
  };
}

// Reused citation sources.
const CITE = {
  BLS: {
    title: "US Bureau of Labor Statistics — Survey of Occupational Injuries and Illnesses",
    url: "https://www.bls.gov/iif/oshsum.htm",
  },
  BLS_CFOI: {
    title: "US Bureau of Labor Statistics — Census of Fatal Occupational Injuries",
    url: "https://www.bls.gov/iif/cfch.htm",
  },
  OSHA_1904: {
    title: "OSHA 29 CFR 1904 — Recording and Reporting Occupational Injuries and Illnesses",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1904",
  },
  OSHA_NOISE: {
    title: "OSHA 29 CFR 1910.95 — Occupational Noise Exposure",
    url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95",
  },
  ILO: {
    title: "International Labour Organization — Occupational Injuries Statistics",
    url: "https://www.ilo.org/global/topics/safety-and-health-at-work/",
  },
  IOGP: {
    title: "IOGP Safety Data Report (annual)",
    url: "https://www.iogp.org/safety-data/",
  },
  HSE_UK_L140: {
    title: "HSE UK L140 — Hand-Arm Vibration",
    url: "https://www.hse.gov.uk/pubns/priced/l140.pdf",
  },
  ISO_2631: {
    title: "ISO 2631-1 — Whole-Body Vibration",
    url: "https://www.iso.org/standard/7612.html",
  },
  ACGIH: {
    title: "ACGIH — Threshold Limit Values",
    url: "https://www.acgih.org/science/tlv-bei-guidelines/",
  },
  ISO_7243: {
    title: "ISO 7243 — WBGT Heat Stress",
    url: "https://www.iso.org/standard/67188.html",
  },
  NIOSH_LIFT: {
    title: "NIOSH Publication 94-110 — Revised Lifting Equation",
    url: "https://www.cdc.gov/niosh/docs/94-110/",
  },
  NFPA_101: {
    title: "NFPA 101 — Life Safety Code",
    url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=101",
  },
  NFPA_10: {
    title: "NFPA 10 — Standard for Portable Fire Extinguishers",
    url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=10",
  },
  ISO_45001: {
    title: "ISO 45001:2018 — Occupational Health and Safety Management Systems",
    url: "https://www.iso.org/standard/63787.html",
  },
  HSE_UK_STRESS: {
    title: "HSE UK — Management Standards for work-related stress",
    url: "https://www.hse.gov.uk/stress/standards/",
  },
  GHG_PROTOCOL: {
    title: "GHG Protocol — Corporate Accounting and Reporting Standard",
    url: "https://ghgprotocol.org/corporate-standard",
  },
  NCCI_EMR: {
    title: "NCCI — Experience Rating Plan Manual",
    url: "https://www.ncci.com",
  },
  OSHA_SAFETY_PAYS: {
    title: "OSHA — $afety Pays Program",
    url: "https://www.osha.gov/safetypays",
  },
} as const;

// Helper — quick placeholder rich content for calculators we haven't
// individually hand-written yet. Keeps every page non-empty.
function genericRich(calc: CalculatorMeta): RichContent {
  return {
    intro: `${calc.seoDescription} This free calculator is based on the published ${calc.regulation} methodology and is released under MIT. Every result is shown with the formula used so you can audit the calculation yourself.`,
    whoUses: [
      "HSE / EHS / QHSE managers running quarterly KPI reviews",
      "Industrial hygienists and occupational health professionals",
      "Safety consultants and auditors",
      "Contractor prequalification teams",
      "ISO 45001 internal auditors",
      "Academics teaching occupational safety courses",
    ],
    howToUse: [
      "Enter the required inputs shown on the calculator form.",
      "The result updates live — no signup, no data sent to a server, all calculation is client-side.",
      "The formula is shown below each result so you can verify against your own workings.",
      "Cite this calculator in your report as: SmartQHSE HSE Calculators — https://tools.smartqhse.com.",
    ],
    examples: [],
    commonMistakes: [
      "Mixing units (hours with days, m/s² with g).",
      "Using US conventions for international reporting (or vice versa). State the base explicitly.",
      "Copy-pasting numbers from another reporting period without verifying.",
    ],
    citations: [{ title: calc.regulation, url: calc.regulationUrl ?? "#" }],
    faqs: [
      {
        q: `What is ${calc.name.toLowerCase()}?`,
        a: calc.shortDescription,
      },
      {
        q: "Is this calculator free?",
        a: "Yes — free, MIT-licensed, zero signup. Embed it on your own site with one line of HTML.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. All calculation happens client-side. No data is sent to SmartQHSE servers.",
      },
    ],
    relatedCalcs: [],
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Rich content per calculator. Add as needed — any calc without an entry
// falls back to genericRich() at lookup time.
// ──────────────────────────────────────────────────────────────────────────
export const RICH_CONTENT: Record<string, RichContent> = {
  "trir-calculator": {
    intro: `TRIR (Total Recordable Incident Rate) is the single most-requested HSE metric in the United States and a core input to OSHA Form 300A, insurance Experience Modification Rate (EMR), and contractor prequalification for every major US industrial client. This free TRIR calculator uses the canonical OSHA 29 CFR 1904.7 formula — (Recordable Incidents × 200,000) ÷ Total Hours Worked — and shows the full formula + equivalent metrics (LTIR, LTIFR, DART) so you can report in whatever convention your audience expects.\n\nThe 200,000-hour base represents 100 full-time-equivalent workers × 40 hours/week × 50 weeks/year. Outside the US (ISO 45001, IOGP, HSE UK) the convention is a 1,000,000-hour base producing LTIFR — we calculate both so you don't have to convert by hand.\n\nUsed by Aramco, ADNOC, QatarEnergy, and Tier-1 US contractors (Bechtel, Fluor, Kiewit) for prequalification. Our results cite the BLS 2024 SOII industry benchmarks so you can see where your rate sits against your specific sector — healthcare 4.5, manufacturing 3.2, construction 2.5, oil & gas 0.8.`,
    whoUses: [
      "EHS managers preparing quarterly board reports",
      "Safety officers calculating OSHA 300A annual submissions",
      "Contractor HSE teams bidding on Aramco / ADNOC / QatarEnergy / Bechtel / Fluor / Kiewit projects",
      "Insurance brokers modelling workers compensation EMR impact",
      "Procurement teams vetting contractor prequalification submissions",
      "ISO 45001 internal auditors reviewing Clause 9.1 monitoring data",
      "Safety-science researchers consolidating industry benchmark studies",
    ],
    howToUse: [
      "Count recordable incidents for the reporting period. Include all cases that made it onto OSHA Form 300 — medical treatment beyond first aid, restricted work, days away, job transfer, deaths, loss of consciousness, significant diagnosed injuries.",
      "Sum total hours worked. This is regular + overtime + holiday hours actually worked, across ALL employees (vacation, sick leave, bereavement are NOT included).",
      "Enter both numbers above. The TRIR displays live with the full formula.",
      "Compare your TRIR against the BLS industry benchmark shown in the Industry Comparison section. A TRIR of 2.5 means very different things for healthcare (excellent) versus finance (concerning).",
      "For international audiences, also report LTIFR (1,000,000-hour base) shown in the results dashboard.",
    ],
    examples: [
      {
        title: "Construction contractor, full year",
        narrative:
          "A 150-worker contractor running 2,000 hours/worker = 300,000 total hours. 4 recordables during the year. TRIR = (4 × 200,000) ÷ 300,000 = 2.67. Against the US construction benchmark of 2.5, this is effectively at industry average.",
      },
      {
        title: "Oil & gas operator, 1 million hours",
        narrative:
          "An upstream operator with 500 workers averaging 2,000 hours/year = 1,000,000 total hours. 2 recordables. TRIR = (2 × 200,000) ÷ 1,000,000 = 0.4. Against the US oil & gas benchmark of 0.8 and IOGP global average of 0.71 (1M base), this is top-decile performance.",
      },
      {
        title: "Healthcare facility, small team",
        narrative:
          "A 50-worker long-term care facility with 100,000 total hours. 3 recordables — mostly patient-handling MSDs. TRIR = (3 × 200,000) ÷ 100,000 = 6.0. Against the healthcare benchmark of 4.5, this indicates ergonomics program opportunity.",
      },
    ],
    commonMistakes: [
      "Double-counting a case that has both days-away AND medical treatment. It's ONE recordable case, counted once.",
      "Including contractor hours that aren't your employees'. OSHA counts host-employer hours only.",
      "Missing overtime hours. Total = regular + OT, whether OT is paid at a premium rate or not.",
      "Including vacation, sick, and bereavement leave in hours-worked. These are NOT hours actually worked.",
      "Counting first-aid-only cases. Only OSHA-recordable cases count — see 29 CFR 1904.7(b)(5)(ii).",
      "Reporting TRIR without stating the base. Always say 'TRIR X.X (OSHA 200,000-hour base)' to prevent confusion with LTIFR.",
      "Comparing monthly TRIR against annual benchmarks. Small-n noise makes monthly values volatile — always annualise or use 12-month rolling.",
    ],
    citations: [
      CITE.OSHA_1904,
      CITE.BLS,
      CITE.IOGP,
      CITE.ISO_45001,
      CITE.NCCI_EMR,
    ],
    faqs: [
      {
        q: "What is a good TRIR?",
        a: "A TRIR below 3.0 is considered acceptable, below 1.0 is world-class. The US private-industry average is 2.7 (BLS 2024). Construction 2.5, manufacturing 3.2, oil & gas 0.8, healthcare 4.5. Always compare against YOUR specific industry.",
      },
      {
        q: "What's the difference between TRIR and LTIFR?",
        a: "TRIR uses OSHA's 200,000-hour base and counts all recordable incidents (US standard). LTIFR uses 1,000,000-hour base and counts only lost-time injuries (ISO/ILO international standard). LTIFR numbers are roughly 5× the equivalent TRIR for the same performance.",
      },
      {
        q: "How do I calculate TRIR?",
        a: "TRIR = (Recordable Incidents × 200,000) ÷ Total Hours Worked. Example: 3 recordables over 500,000 hours = 1.2. The 200,000 base represents 100 FTE × 40 hr/week × 50 weeks.",
      },
      {
        q: "Is this TRIR calculator accurate?",
        a: "Yes — it uses the canonical OSHA 29 CFR 1904.7 formula. The same math your OSHA inspector, your EMR broker, and IOGP use. Result shown with full formula so you can verify.",
      },
      {
        q: "Can I use this for OSHA 300A submission?",
        a: "Yes — the calculation is identical to what OSHA requires on Form 300A. But you still need to maintain the underlying OSHA 300 log of individual cases, plus OSHA 301 incident reports, in the actual submission.",
      },
      {
        q: "What does 'recordable' mean?",
        a: "Any work-related injury or illness resulting in: medical treatment beyond first aid, days away from work, restricted work or job transfer, loss of consciousness, significant injury/illness diagnosed by a healthcare professional, or death. Full list in 29 CFR 1904.7.",
      },
      {
        q: "Does TRIR include contractors?",
        a: "It depends on the host-employer/contractor relationship. OSHA counts only employees who fall under the employer's recordkeeping duty. Contractors with their own OSHA responsibility count their own cases. For prequalification systems (ISN, Avetta), you often report both your direct TRIR and flow contractor TRIR into project-level numbers.",
      },
      {
        q: "Do I need a TRIR of 0 to pass prequalification?",
        a: "No. Most major US industrial clients require TRIR below a specific threshold (typically 1.0-2.0 depending on industry and client). Zero TRIR is rare at meaningful scale and often raises underreporting concerns.",
      },
    ],
    relatedCalcs: [
      "ltir-calculator",
      "ltifr-calculator",
      "dart-rate-calculator",
      "severity-rate-calculator",
      "emr-calculator",
      "incident-cost-calculator",
    ],
    benchmarks: {
      unit: "per 100 FTE (200,000-hour base)",
      source: "US Bureau of Labor Statistics 2024 SOII",
      sourceUrl: "https://www.bls.gov/iif/oshsum.htm",
      rows: [
        { industry: "Oil and gas extraction", value: 0.8 },
        { industry: "Finance and insurance", value: 0.5 },
        { industry: "Utilities", value: 1.3 },
        { industry: "Mining", value: 1.5 },
        { industry: "Education", value: 1.7 },
        { industry: "Wholesale trade", value: 2.4 },
        { industry: "Construction", value: 2.5 },
        { industry: "US private industry (avg)", value: 2.7, label: "average" },
        { industry: "Retail trade", value: 3.1 },
        { industry: "Manufacturing", value: 3.2 },
        { industry: "Transportation", value: 4.1 },
        { industry: "Healthcare", value: 4.5 },
        { industry: "Agriculture", value: 4.6 },
      ],
      thresholds: { good: 1.0, average: 3.0 },
    },
  },

  "ltir-calculator": {
    intro: `LTIR (Lost Time Incident Rate) counts only recordable cases where the worker lost at least one day away from work. It's a subset of TRIR focused on severity — per OSHA 29 CFR 1904.7(b)(3) with a 200,000-hour base. US all-industry average is approximately 1.3 per 100 FTE (BLS 2024). Used by Aramco, ADNOC, and many US clients as a prequalification filter since it filters out the medical-treatment-only noise that can inflate TRIR.\n\nThe calculator also displays the equivalent LTIFR (1,000,000-hour base — ISO 45001 / IOGP convention) so you can report to both US and international audiences from a single input.`,
    whoUses: [
      "Safety managers tracking severity trends alongside frequency (TRIR)",
      "Contractor prequalification teams (many Tier-1 clients prioritise LTIR over TRIR)",
      "Insurance brokers assessing severity loss profiles",
      "IOGP / ISO 45001 programs reporting LTIFR internationally",
    ],
    howToUse: [
      "Count lost-time incidents — recordable cases with one or more days away from work (NOT restricted work or job transfer, just days away).",
      "Sum total hours worked during the reporting period.",
      "The calculator shows both LTIR (200k base) and the equivalent LTIFR (1M base) so you can report either.",
    ],
    examples: [
      {
        title: "Typical mid-size contractor",
        narrative:
          "200 workers × 2000 hours = 400,000 total hours. 2 lost-time incidents. LTIR = (2 × 200,000) ÷ 400,000 = 1.0. Equivalent LTIFR (1M base) = 5.0. Both world-class.",
      },
    ],
    commonMistakes: [
      "Including restricted-work cases in LTIR. LTIR counts only days-away cases. Restricted work appears in DART but not LTIR.",
      "Confusing LTIR and LTIFR. They measure the same thing but use different bases (200k vs 1M).",
    ],
    citations: [CITE.OSHA_1904, CITE.BLS, CITE.IOGP, CITE.ISO_45001],
    faqs: [
      {
        q: "What is LTIR?",
        a: "Lost Time Incident Rate — cases with days away from work per 100 full-time-equivalent workers (OSHA 200,000-hour base).",
      },
      {
        q: "LTIR vs LTIFR?",
        a: "Same scope (lost-time injuries) but different base. LTIR uses 200,000 hours (OSHA); LTIFR uses 1,000,000 hours (ILO/ISO). LTIFR ≈ LTIR × 5.",
      },
    ],
    relatedCalcs: [
      "trir-calculator",
      "ltifr-calculator",
      "dart-rate-calculator",
      "severity-rate-calculator",
    ],
    benchmarks: {
      unit: "per 100 FTE (200,000-hour base)",
      source: "BLS 2024 SOII (derived)",
      sourceUrl: "https://www.bls.gov/iif/oshsum.htm",
      rows: [
        { industry: "Oil and gas extraction", value: 0.4 },
        { industry: "Mining", value: 0.7 },
        { industry: "Construction", value: 1.3 },
        { industry: "US private industry (avg)", value: 1.3, label: "average" },
        { industry: "Manufacturing", value: 1.6 },
        { industry: "Healthcare", value: 2.3 },
        { industry: "Transportation", value: 2.2 },
      ],
      thresholds: { good: 0.5, average: 1.5 },
    },
  },

  "ltifr-calculator": {
    intro: `LTIFR (Lost Time Injury Frequency Rate) is the international equivalent of LTIR — ISO 45001:2018 / ILO / IOGP standard — using a 1,000,000-hour base. Required by HSE UK reporting, Aramco / ADNOC / QatarEnergy contractor prequalification, and ISO 45001 Clause 9.1 management review.\n\nIOGP reports global oil & gas LTIFR at 0.21 per million hours (2023), with Middle East at 0.16 — the lowest of any region. World-class LTIFR across non-oil-and-gas industries is below 1.0. Our calculator shows both LTIFR and the equivalent OSHA LTIR so you can report to every audience.`,
    whoUses: [
      "International safety managers (non-US)",
      "Contractors bidding Aramco, ADNOC, QatarEnergy, SABIC, KNPC, PDO",
      "ISO 45001 Clause 9.1 monitoring",
      "HSE UK annual reporting",
      "IOGP member safety data submissions",
    ],
    howToUse: [
      "Count lost-time injuries — cases with one or more days away from work.",
      "Sum total hours worked during the period.",
      "LTIFR displays live. Also shows OSHA LTIR equivalent if US reporting is needed.",
    ],
    examples: [
      {
        title: "GCC oil & gas mega-project",
        narrative:
          "12 million hours on a major Aramco / ADNOC project. 2 lost-time injuries. LTIFR = (2 × 1,000,000) ÷ 12,000,000 = 0.17. Top-tier performance — matches IOGP Middle East regional average.",
      },
    ],
    commonMistakes: [
      "Comparing LTIFR against OSHA TRIR benchmarks directly. Conversions are approximate — state the base.",
      "Reporting LTIFR without clarifying whether restricted work is included (IOGP counts only lost-time; some national stats include restricted).",
    ],
    citations: [CITE.ILO, CITE.IOGP, CITE.ISO_45001, CITE.OSHA_1904],
    faqs: [
      {
        q: "What is LTIFR?",
        a: "Lost Time Injury Frequency Rate — LTIs per million hours worked. International safety standard (ISO 45001 / ILO / IOGP).",
      },
      {
        q: "LTIFR benchmark for oil & gas?",
        a: "IOGP global: 0.21 (2023). Middle East region: 0.16. Europe: 0.25. World-class across industries: <1.0.",
      },
    ],
    relatedCalcs: ["trir-calculator", "ltir-calculator", "dart-rate-calculator", "severity-rate-calculator"],
    benchmarks: {
      unit: "per 1,000,000 hours (ILO/IOGP base)",
      source: "IOGP 2023 Safety Data Report + HSE UK + ILO",
      sourceUrl: "https://www.iogp.org/safety-data/",
      rows: [
        { industry: "Oil & gas — Middle East (IOGP)", value: 0.16 },
        { industry: "Oil & gas — global (IOGP)", value: 0.21 },
        { industry: "Oil & gas — Europe (IOGP)", value: 0.25 },
        { industry: "World-class benchmark (any industry)", value: 1.0, label: "world-class" },
        { industry: "General industry (typical)", value: 5.0, label: "average" },
        { industry: "Construction global (typical)", value: 5.0 },
      ],
      thresholds: { good: 1.0, average: 5.0 },
    },
  },

  "wbgt-calculator": {
    intro: `WBGT (Wet Bulb Globe Temperature) is the gold-standard heat stress metric — ACGIH Threshold Limit Value / ISO 7243. It combines wet-bulb (humidity + evaporation), globe (radiant heat), and dry-bulb (air temperature) into a single value that predicts heat illness risk better than any simpler measure.\n\nCritical for GCC summer construction (UAE, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain all enforce midday work bans based on WBGT), foundry and glass-making operations (indoor radiant heat), firefighter training, and agricultural work in hot climates. The calculator outputs WBGT in °C plus ACGIH TLV-based work/rest ratios for acclimatised and unacclimatised workers.`,
    whoUses: [
      "GCC construction supervisors planning summer shift rotations",
      "Industrial hygienists assessing foundry / glass / kiln operations",
      "Military and emergency-services trainers",
      "Agricultural operators in hot climates",
      "OHS researchers modelling climate change impacts on workforces",
    ],
    howToUse: [
      "Measure (or estimate) dry-bulb temperature in °C.",
      "Measure relative humidity as a percentage.",
      "Measure globe temperature (black globe thermometer, 150mm). If not available, estimate as dry-bulb + 5°C in sun, + 2°C in shade.",
      "Select 'outdoor' if work is in direct sunlight, 'indoor' if not.",
      "Read WBGT + recommended work/rest cycle per ACGIH TLV.",
    ],
    examples: [
      {
        title: "Dubai construction, midday July",
        narrative:
          "Dry-bulb 42°C, RH 50%, globe 48°C, outdoor. WBGT ≈ 34.5°C → EXTREME. Work/rest: stop work. This is why UAE bans outdoor work 12:30-15:00 June-September.",
      },
      {
        title: "Steel foundry, air-conditioned shop",
        narrative:
          "Dry-bulb 32°C, RH 30%, globe 42°C (radiant heat from furnaces), indoor. WBGT ≈ 30°C → HIGH. Work/rest cycle: 50/50 per hour for moderate-workload acclimatised workers.",
      },
    ],
    commonMistakes: [
      "Using plain air temperature instead of WBGT. Air temperature alone ignores humidity and radiant heat — the actual physiological stressors.",
      "Applying acclimatised worker thresholds to a new arrival. Unacclimatised workers need thresholds 2.5°C lower during the first 14 days.",
      "Measuring WBGT in shade when workers are in direct sun. The globe thermometer must be exposed to actual working conditions.",
      "Ignoring clothing. Heavy PPE, turnout gear, or chemical-resistant suits add effective WBGT of 3-5°C.",
    ],
    citations: [CITE.ACGIH, CITE.ISO_7243],
    faqs: [
      {
        q: "What is WBGT?",
        a: "Wet Bulb Globe Temperature — a composite heat stress metric combining air temperature, humidity, and radiant heat. Adopted by ACGIH and ISO 7243 as the gold standard.",
      },
      {
        q: "What WBGT triggers work/rest cycles?",
        a: "For moderate-workload acclimatised workers (ACGIH TLV): continuous <27.5°C; 75/25 at 27.5-29.5; 50/50 at 29.5-31.5; 25/75 at 31.5-32.5; stop work above 32.5°C. Unacclimatised: subtract 2.5°C.",
      },
      {
        q: "What WBGT does UAE/Saudi/Qatar midday work ban correspond to?",
        a: "GCC midday bans (12:00-15:00 roughly) align with WBGT typically 32-35°C in mid-summer. Ban is minimum compliance; WBGT-based cycling should apply outside ban hours too.",
      },
    ],
    relatedCalcs: [],
  },

  "risk-matrix-calculator": {
    intro: `Risk matrices are the most common semi-quantitative risk scoring method in HSE. A 5×5 matrix (likelihood × severity) is standard in oil & gas (Aramco SAIC-SS, ADNOC, QatarEnergy, IOGP); a 4×4 matrix is common in construction. Both are supported.\n\nRequired by ISO 45001:2018 Clause 6.1.2 (hazard identification and risk assessment), IEC 31010 (risk management techniques), and nearly every national OSH framework. This calculator outputs the risk score, risk band (low/medium/high/extreme), recommended action, and colour-code.`,
    whoUses: [
      "Risk assessment authors (JSA, HAZOP, HAZID, TRA)",
      "ISO 45001 implementation teams",
      "Oil & gas contractor HSE",
      "Construction HSE managers",
      "ALARP justification for regulator submissions",
    ],
    howToUse: [
      "Identify the hazard scenario you're scoring.",
      "Score Likelihood (1-5) using your organisation's definitions.",
      "Score Severity (1-5) using your organisation's definitions.",
      "Read the risk score (L × S), band, and recommended action.",
    ],
    examples: [
      {
        title: "Hot work in a flammable atmosphere",
        narrative:
          "Likelihood 4 (likely if controls fail) × Severity 5 (catastrophic — fatality possible from ignition). Score = 20 → EXTREME. Action: stop work, escalate. Re-plan with engineering controls (gas-free certificate, hot-work permit with fire watch) to reduce to Likelihood 1 × Severity 5 = 5 → MEDIUM.",
      },
    ],
    commonMistakes: [
      "Using subjective scales without defined likelihood/severity anchors. Different people score differently without anchors.",
      "Scoring residual risk instead of raw risk. Best practice: score both (pre-controls + post-controls) and show reduction.",
      "Applying matrix blind-spots — a 1 × 5 (low likelihood, catastrophic severity) scores low (5) but warrants robust bow-tie analysis because of severity alone.",
    ],
    citations: [CITE.ISO_45001],
    faqs: [
      {
        q: "5×5 vs 4×4 risk matrix?",
        a: "5×5 is standard in oil & gas (Aramco, ADNOC, QatarEnergy, IOGP). 4×4 is common in construction. Use what your organisation or client specifies.",
      },
      {
        q: "Can risk scoring alone be the HAZID output?",
        a: "No. A risk matrix ranks but doesn't identify hazards. Use HAZID / HAZOP / what-if techniques to identify, then risk matrix to rank. ISO 45001 Clause 6.1.2 requires both.",
      },
    ],
    relatedCalcs: ["safety-score-calculator", "stress-risk-calculator"],
  },

  "hav-calculator": {
    intro: `Hand-Arm Vibration (HAV) exposure A(8) under HSE UK L140 / ISO 5349-1 / EU 2002/44/EC. Exposure Action Value (EAV) is 2.5 m/s² — above this, employers must implement a vibration risk reduction programme. Exposure Limit Value (ELV) is 5.0 m/s² — above this, work must stop.\n\nHAVS (Hand-Arm Vibration Syndrome) and Vibration White Finger are the reportable outcomes. Primary exposed populations: construction (breakers, grinders, chipping hammers), forestry (chainsaws), foundries (deburring, grinding), and pipeline maintenance.`,
    whoUses: [
      "Construction HSE managers using impact and rotary tools",
      "Occupational hygienists assessing tool-vibration programmes",
      "Regulator compliance teams (HSE UK, EU member states)",
      "Tool manufacturers publishing A(8) data for buyers",
    ],
    howToUse: [
      "Measure or look up the vibration magnitude (m/s², weighted RMS) of the tool in use.",
      "Estimate exposure duration in hours — trigger time, NOT clock time holding the tool.",
      "Read A(8). If above 2.5 m/s² (EAV), action required. If above 5.0 m/s² (ELV), stop.",
    ],
    examples: [
      {
        title: "Breaker operator, 3 hours trigger time",
        narrative:
          "Tool magnitude 12 m/s² × √(3/8) = A(8) ~7.3 m/s². Above ELV (5.0) — exposure must stop. Reduce exposure time (<1.4h to stay below ELV) or swap tool.",
      },
    ],
    commonMistakes: [
      "Using clock time instead of trigger time. Trigger time = hand actually on the running tool, not lunch + cleanup + idle.",
      "Using the manufacturer's single-axis value when triaxial measurement is required for comparison to EAV/ELV.",
      "Ignoring the additive effect of multiple tools in a shift. Daily A(8) is the ENERGY sum, not average.",
    ],
    citations: [CITE.HSE_UK_L140, CITE.ACGIH],
    faqs: [
      {
        q: "What is A(8)?",
        a: "The daily vibration exposure normalised to an 8-hour reference period: A(8) = a × √(T/8) where a is the vibration magnitude and T is actual exposure time in hours.",
      },
      {
        q: "What's the HAV action level?",
        a: "EAV = 2.5 m/s² A(8) triggers formal risk reduction programme. ELV = 5.0 m/s² A(8) requires exposure to stop.",
      },
    ],
    relatedCalcs: ["wbv-calculator", "noise-dose-calculator"],
  },

  "noise-dose-calculator": {
    intro: `Occupational noise dose under OSHA 29 CFR 1910.95 — the most-cited occupational exposure standard globally. OSHA PEL (Permissible Exposure Limit): 90 dB(A) 8-hour TWA with 5-dB exchange rate. Action level (hearing conservation trigger): 85 dB(A). ACGIH TLV (more conservative) and EU Directive 2003/10/EC use 3-dB exchange rate and an 85 dB(A) limit.\n\nWorkers exposed above the action level require audiometric testing, hearing protection provision, and training. Approximately 22 million US workers (NIOSH) have hazardous occupational noise exposure.`,
    whoUses: [
      "Industrial hygienists running noise surveys",
      "Manufacturing, construction, mining HSE programs",
      "Hearing conservation programme coordinators",
      "Regulator compliance (OSHA, HSE UK, EU member states)",
    ],
    howToUse: [
      "Enter the measured Leq (equivalent continuous sound level in dB(A)).",
      "Enter exposure duration in hours.",
      "Choose the exchange rate — 5 dB (OSHA) or 3 dB (ACGIH / EU).",
      "Read dose %, 8-hour TWA, and action-level status.",
    ],
    examples: [
      {
        title: "Concrete mixer operator, OSHA",
        narrative:
          "95 dB(A) for 8 hours with OSHA 5-dB exchange. TWA = 95 dB(A). Dose = 200%. Above PEL — must reduce exposure or provide effective hearing protection + hearing conservation programme.",
      },
    ],
    commonMistakes: [
      "Mixing exchange rates. A value computed with OSHA's 5-dB rate is NOT directly comparable to ACGIH's 3-dB rate.",
      "Reading the sound level meter but not converting to dose. A short exposure to 110 dB(A) is massively more dose than an 8-hour exposure to 85 dB(A).",
      "Assuming hearing protection fully attenuates. Real-world fit reduces rated attenuation by 50% in typical construction use.",
    ],
    citations: [CITE.OSHA_NOISE, CITE.ACGIH],
    faqs: [
      {
        q: "What is the OSHA noise exposure limit?",
        a: "90 dB(A) as 8-hour TWA (PEL). 85 dB(A) TWA is the Action Level triggering hearing conservation programme.",
      },
      {
        q: "OSHA 5-dB vs ACGIH 3-dB exchange rate?",
        a: "OSHA uses 5-dB (every 5 dB halves permissible duration). ACGIH and EU use 3-dB (more conservative, matches equal-energy principle).",
      },
    ],
    relatedCalcs: ["hav-calculator", "wbv-calculator"],
  },

  "niosh-lifting-calculator": {
    intro: `NIOSH Revised Lifting Equation (1994) computes Recommended Weight Limit (RWL) and Lifting Index (LI) for manual lifting tasks. It's the most widely used ergonomic assessment for manual handling in the US and internationally. Based on 6 multipliers — horizontal distance, vertical origin, vertical travel, asymmetry angle, frequency, coupling.\n\nUsed in OSHA ergonomic citations (General Duty Clause), NIOSH research, HSE UK alternative to the MAC tool, and virtually every academic manual-handling study since 1994.`,
    whoUses: [
      "Ergonomics consultants",
      "Warehouse and logistics HSE teams",
      "Healthcare patient-handling programs (nurses, aides)",
      "Manufacturing assembly-line designers",
      "OSHA General Duty Clause investigations",
    ],
    howToUse: [
      "Measure horizontal distance H (cm) from ankles to hand position at lift origin.",
      "Measure vertical origin V (cm) — hand height from floor at lift start.",
      "Measure vertical travel D (cm) — total up/down distance of the lift.",
      "Estimate asymmetry angle A (degrees) — twist required.",
      "Estimate frequency F (lifts/minute) and duration hours.",
      "Select coupling quality (grip condition).",
      "Enter actual load kg.",
    ],
    examples: [
      {
        title: "Warehouse picker",
        narrative:
          "H=30cm, V=75cm, D=50cm, A=0°, F=2/min, 4-hour duration, good grip, 15kg load. RWL computes to roughly 15kg; LI ≈ 1.0. At the acceptable threshold — but any increase in frequency or load pushes this past increased risk.",
      },
    ],
    commonMistakes: [
      "Using the Lifting Index as a pass/fail. LI ≤ 1.0 means 'most workers can do this safely'; LI > 3 means 'most workers CANNOT do this safely'. The 1-3 range requires case-by-case judgement.",
      "Ignoring frequency multiplier adjustments for long-duration tasks (>2 hours).",
      "Applying NIOSH equation to lifts with significant carrying or pushing components. NIOSH is for lifting only.",
    ],
    citations: [CITE.NIOSH_LIFT, CITE.ACGIH],
    faqs: [
      {
        q: "What is the Lifting Index (LI)?",
        a: "LI = Load / RWL. LI ≤ 1.0 acceptable for most workers. LI > 3.0 high risk for most workers.",
      },
    ],
    relatedCalcs: ["manual-handling-calculator"],
  },

  "manhours-calculator": {
    intro: `Total manhours (exposure hours) is the denominator in almost every HSE rate calculation — TRIR, LTIR, LTIFR, DART, severity, frequency. Incorrect manhours under-reports or over-reports rates by proportional error. This calculator handles regular + overtime across arbitrary shift patterns.\n\nUnder OSHA 29 CFR 1904.7, hours worked for rate calculation means actual on-the-clock hours — vacation, sick leave, bereavement, holiday-off-duty do NOT count. Overtime counts whether paid at a premium rate or not.`,
    whoUses: [
      "HSE reporting teams computing monthly/quarterly/annual rates",
      "Contractor prequalification submission teams (ISN, Avetta, Veriforce)",
      "ISO 45001 Clause 9.1 monitoring",
      "Insurance brokers modelling EMR",
    ],
    howToUse: [
      "Count all workers on the project/site for the period.",
      "Enter average hours per day.",
      "Enter number of working days in the period.",
      "Add overtime percentage if applicable.",
    ],
    examples: [
      {
        title: "Construction project, 20-day month",
        narrative:
          "150 workers × 10 hours/day × 20 days × 1.15 (15% OT) = 34,500 hours. Use this as the denominator for the month's TRIR.",
      },
    ],
    commonMistakes: [
      "Counting vacation/sick/holiday time as hours worked. Only actual working hours count.",
      "Forgetting to include overtime.",
      "Using contractor hours in host-employer TRIR calculation.",
    ],
    citations: [CITE.OSHA_1904, CITE.ISO_45001],
    faqs: [
      {
        q: "Do overtime hours count?",
        a: "Yes — all hours actually worked count, regardless of pay rate.",
      },
    ],
    relatedCalcs: ["trir-calculator", "ltir-calculator", "ltifr-calculator"],
  },

  "emr-calculator": {
    intro: `EMR (Experience Modification Rate) is a multiplier applied to workers compensation insurance premiums based on your claims history vs expected losses. 1.0 is industry baseline. Below 1.0 saves money; above 1.0 costs more. Below 0.75 is typically required for Tier-1 US contractor prequalification (ExxonMobil, Chevron, Bechtel, Fluor, Kiewit).\n\nCalculated by NCCI or your state workers comp bureau using a 3-year experience period ending 1 year before the current policy year. An EMR swing of 0.20 on a $5M/year premium = $1M difference.`,
    whoUses: [
      "US-based contractors bidding Tier-1 clients",
      "Insurance brokers modelling premium impact of safety improvements",
      "Safety ROI business cases",
      "CFO quarterly reviews",
    ],
    howToUse: [
      "Look up Actual Losses from your workers comp loss runs.",
      "Get Expected Losses from your NCCI rate sheet.",
      "Divide.",
    ],
    examples: [
      {
        title: "Contractor with $150K actual vs $200K expected",
        narrative: "EMR = 0.75. Excellent — 25% below baseline. Discounts workers comp premium by roughly 25%.",
      },
    ],
    commonMistakes: [
      "Treating EMR as instantly responsive to safety improvements. The 3-year experience period means a safe year takes 4 years to fully propagate.",
      "Ignoring the audit — about 15% of NCCI EMR calculations have errors.",
    ],
    citations: [CITE.NCCI_EMR],
    faqs: [
      {
        q: "What is a good EMR?",
        a: "Below 1.0 is good. Below 0.75 is excellent. Most Tier-1 US prequalification requires ≤ 1.0; preferred tier ≤ 0.9.",
      },
    ],
    relatedCalcs: ["incident-cost-calculator"],
  },

  "incident-cost-calculator": {
    intro: `OSHA $afety Pays model — direct + indirect cost per incident. Indirect costs (investigation, lost productivity, training replacement, morale) run 1.1× to 4.5× direct cost depending on severity. Revenue-needed calculation shows sales required at your profit margin to offset the incident cost.\n\nUsed in safety ROI business cases, board reports, and insurance negotiations. Aligns with OSHA's published $afety Pays estimator.`,
    whoUses: [
      "Safety managers building ROI business cases",
      "CFOs evaluating EHS programme investments",
      "Brokers negotiating insurance premiums",
      "Researchers studying incident economics",
    ],
    howToUse: [
      "Enter the direct cost (medical, lost wages, workers comp).",
      "Select severity — first aid / medical / restricted / lost time / fatality.",
      "Read total cost + revenue needed to recover at your margin.",
    ],
    examples: [
      {
        title: "$10,000 medical-treatment incident at 10% margin",
        narrative: "Direct $10K + indirect $11K (1.1× ratio) = $21K total. Revenue needed to net $21K at 10% margin = $210K. A reportable medical case costs roughly 20× its direct medical cost in net revenue impact.",
      },
    ],
    commonMistakes: [
      "Counting only direct costs. Indirect costs are often larger and routinely missed.",
      "Ignoring the revenue-needed calculation in board presentations — reframes 'safety cost' as 'safety investment'.",
    ],
    citations: [CITE.OSHA_SAFETY_PAYS],
    faqs: [
      {
        q: "What's the ratio of indirect to direct incident cost?",
        a: "OSHA's $afety Pays model uses 4.5× for first-aid (high ratio because direct is tiny), 1.1× for medical and restricted, 1.0× for lost-time, 0.6× for fatality.",
      },
    ],
    relatedCalcs: ["emr-calculator", "trir-calculator"],
  },

  "severity-rate-calculator": {
    intro: `Severity Rate measures average days lost per recordable incident. Complementary to TRIR (which counts frequency). Low severity means you're catching incidents before they become severe; high severity means your injuries are serious when they happen. Use both metrics together — a TRIR of 1 with severity of 100 is VERY different from TRIR of 1 with severity of 10.\n\nOSHA convention uses 200,000-hour base; ILO/ISO uses 1,000,000. This calculator supports both.`,
    whoUses: [
      "Safety managers tracking severity trends",
      "Insurance underwriters modelling severity loss profiles",
      "ISO 45001 Clause 9.1 monitoring",
    ],
    howToUse: [
      "Count total days lost from all recordable cases.",
      "Enter total hours worked.",
      "Select base (OSHA or ISO).",
    ],
    examples: [],
    commonMistakes: [],
    citations: [CITE.OSHA_1904, CITE.ILO],
    faqs: [
      {
        q: "What is severity rate?",
        a: "Days lost × base ÷ hours worked. OSHA base 200,000; ISO/ILO base 1,000,000.",
      },
    ],
    relatedCalcs: ["trir-calculator", "ltir-calculator", "ltifr-calculator"],
  },

  "frequency-rate-calculator": {
    intro: `International Accident Frequency Rate (AFR) — HSE UK / IOGP standard. 1,000,000-hour base. Used by UK and most Commonwealth countries for mandatory reporting, and by IOGP members for global oil & gas benchmarking.\n\nConvertible to OSHA TRIR via the 5× rule of thumb (TRIR ≈ AFR ÷ 5 approximately, though scope differs).`,
    whoUses: ["UK HSE reporting", "IOGP members", "Commonwealth OSH regulators"],
    howToUse: ["Count accidents. Enter hours. Read AFR."],
    examples: [],
    commonMistakes: [],
    citations: [CITE.IOGP, CITE.ILO],
    faqs: [
      {
        q: "AFR vs TRIR?",
        a: "Different bases — 1M (AFR) vs 200k (TRIR). Different scopes — AFR varies by regulator; TRIR is OSHA-defined.",
      },
    ],
    relatedCalcs: ["trir-calculator", "ltifr-calculator"],
  },

  "dart-rate-calculator": {
    intro: `DART Rate — Days Away, Restricted, Transferred. OSHA's severity-focused subset of TRIR. Used in OSHA VPP Star status eligibility, BLS benchmarking, and many US contractor prequalification systems.\n\nCounts cases with days away OR restricted work OR job transfer. A low DART relative to TRIR means your recordables are less severe (many medical-only cases); a high DART means recordables are mostly severe.`,
    whoUses: ["OSHA VPP applicants", "US prequalification"],
    howToUse: ["Count DART cases. Enter hours. Read rate."],
    examples: [],
    commonMistakes: [],
    citations: [CITE.OSHA_1904, CITE.BLS],
    faqs: [
      {
        q: "DART vs LTIR?",
        a: "DART includes restricted work and job transfer. LTIR counts only days-away cases.",
      },
    ],
    relatedCalcs: ["trir-calculator", "ltir-calculator", "severity-rate-calculator"],
  },

  "safety-score-calculator": {
    intro: `Composite safety performance score (0-100) weighting TRIR, LTIFR, near-miss reporting ratio, training completion, and audit compliance. A single dashboard number for board reporting. Not a regulatory requirement — a useful rollup.`,
    whoUses: ["Executive safety dashboards", "ESG reporting"],
    howToUse: ["Enter any subset of inputs. The composite weights what you provide."],
    examples: [],
    commonMistakes: [],
    citations: [CITE.ISO_45001],
    faqs: [],
    relatedCalcs: ["trir-calculator", "ltifr-calculator"],
  },

  "stress-risk-calculator": {
    intro: `HSE UK Management Standards for work-related stress — 6 domains rated 1-5. Required in UK under the HSE's stress management approach; internationally aligned with ISO 45003:2021 (psychosocial health at work).`,
    whoUses: ["HR + HSE joint programmes", "ISO 45003 implementations", "UK employers"],
    howToUse: ["Score each of 6 domains 1 (very poor) to 5 (very good)."],
    examples: [],
    commonMistakes: [],
    citations: [CITE.HSE_UK_STRESS],
    faqs: [],
    relatedCalcs: ["safety-score-calculator"],
  },

  "carbon-footprint-calculator": {
    intro: `GHG Protocol Scope 1 + Scope 2 + Scope 3 carbon accounting. Scope 1: direct combustion (vehicles, boilers). Scope 2: purchased electricity (region-specific grid factors). Scope 3: value chain — business travel, waste, etc. Required for CSRD (EU), TCFD-aligned disclosures, and ISO 14064-1 verification.`,
    whoUses: ["ESG reporting teams", "CSRD / TCFD disclosures", "ISO 14064-1 implementations"],
    howToUse: ["Enter activity data (litres diesel, kWh, km flown). The calculator applies GHG Protocol factors."],
    examples: [],
    commonMistakes: [],
    citations: [CITE.GHG_PROTOCOL],
    faqs: [],
    relatedCalcs: [],
  },

  "wbv-calculator": {
    intro: `Whole-Body Vibration A(8) — ISO 2631-1 / EU 2002/44/EC. EAV 0.5 m/s², ELV 1.15 m/s². Critical for truck drivers, excavator operators, forklift operators, heavy plant operators.`,
    whoUses: ["Haulage HSE", "Mining", "Earthmoving contractors"],
    howToUse: ["Enter axis-specific vibration magnitude and exposure hours."],
    examples: [],
    commonMistakes: [],
    citations: [CITE.ISO_2631],
    faqs: [],
    relatedCalcs: ["hav-calculator", "noise-dose-calculator"],
  },

  "fire-load-calculator": {
    intro: `Fire load density (MJ/m²) under NFPA 557 / BS 9999 / Eurocode EN 1991-1-2. Required in fire risk assessments and fire engineering calculations for building egress design.`,
    whoUses: ["Fire engineers", "Building code compliance", "Fire risk assessors"],
    howToUse: ["Enter combustible mass per material + floor area."],
    examples: [],
    commonMistakes: [],
    citations: [],
    faqs: [],
    relatedCalcs: ["evacuation-time-calculator", "fire-extinguisher-size-calculator"],
  },

  "evacuation-time-calculator": {
    intro: `Required Safe Egress Time (RSET) per NFPA 101 / BS 9999. Combines pre-movement time + travel time + flow-through-exits time. Required in fire risk assessments for occupied buildings above certain thresholds.`,
    whoUses: ["Fire engineers", "Building code compliance"],
    howToUse: ["Enter occupants, travel distance, exit widths, pre-movement time."],
    examples: [],
    commonMistakes: [],
    citations: [CITE.NFPA_101],
    faqs: [],
    relatedCalcs: ["fire-load-calculator"],
  },

  "manual-handling-calculator": {
    intro: `HSE UK MAC tool (Manual Assessment Charts) simplified banding — Green / Amber / Red. A faster alternative to NIOSH Lifting Equation for field use.`,
    whoUses: ["UK construction HSE", "Warehouse operations"],
    howToUse: ["Enter load, carry distance, frequency, postural adjustments."],
    examples: [],
    commonMistakes: [],
    citations: [],
    faqs: [],
    relatedCalcs: ["niosh-lifting-calculator"],
  },
};

/** Safe lookup — never throws, falls back to generic content. */
export function getRichContent(calc: CalculatorMeta): RichContent {
  return RICH_CONTENT[calc.slug] ?? genericRich(calc);
}
