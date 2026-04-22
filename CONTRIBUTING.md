# Contributing to @smartqhse/hse-calculators

Thanks for your interest. Every formula in this library is regulation-cited (OSHA, HSE UK, ISO, ILO, ACGIH, NIOSH, NFPA) — so contributions need to follow the same bar.

## How to add a new calculator

1. **Find the regulation or peer-reviewed source.** No "proprietary" formulas.
2. **Add the pure function** in the appropriate file:
   - `src/core/incident-rates.ts` — rate-per-base calculations
   - `src/core/exposure.ts` — noise, vibration, chemical
   - `src/core/ergonomics.ts` — REBA, RULA, NIOSH, manual handling
   - `src/core/environmental.ts` — heat, lighting, ventilation, carbon
   - `src/core/fire.ts` — fire load, evacuation, extinguisher
   - `src/core/workload.ts` — manhours, FTE
   - `src/core/risk.ts` — matrices, scoring
3. **Register the calculator** in `src/core/registry.ts` with:
   - SEO-optimised `seoTitle` (under 70 chars) and `seoDescription` (under 170 chars)
   - Keyword-rich `keywords` array (aim for 8-15 long-tail terms)
   - Clear `formula` string
   - Authoritative `regulation` citation with URL if available
   - `inputs` array for the web UI
4. **Write unit tests** in `src/core/__tests__/`. Include at least one test matching a published example from the regulation.
5. **Add a dispatch case** in `src/components/CalculatorForm.tsx`.

## Formula standards

- Use SI units internally (kg, m, m/s², °C, dB(A))
- Return `Number(x.toFixed(n))` rather than raw floats where `n` matches the regulation's published precision
- Include `formula` string in the result object — auditability matters
- Handle zero-division safely — return 0 or Infinity meaningfully, never `NaN`

## Commits

Conventional commit format:
- `feat: add X calculator`
- `fix: correct WBGT indoor formula`
- `docs: update regulation citation`

## Code style

Prettier + ESLint. Run `npm run lint` before pushing.

## Questions

Open a [GitHub discussion](https://github.com/SmartQHSE/hse-calculators/discussions) or reach out at support@smartqhse.com.
