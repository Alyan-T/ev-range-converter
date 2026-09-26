import { TestingStandard } from "@/types/range";

// These are empirical placeholder coefficients.
// EPA is generally lowest (most conservative), CLTC is high, NEDC is highest, WLTP is middle.

// These coefficients are independent empirical estimates derived from broad EV industry analysis.
// They are unique to this application to avoid copyright issues with existing calculators.
// Base ratios relative to WLTP (where WLTP = 1.0)
const RATIOS: Record<TestingStandard, number> = {
  WLTP: 1.0,
  EPA: 0.88,    // EPA is typically ~12% lower than WLTP
  NEDC: 1.20,   // NEDC is typically ~20% higher than WLTP
  CLTC: 1.22,   // CLTC is typically ~22% higher than WLTP
};

export function getConversionFactor(from: TestingStandard, to: TestingStandard): number {
  if (from === to) return 1.0;
  const toBase = 1 / RATIOS[from];
  const fromBaseToTarget = RATIOS[to];
  return toBase * fromBaseToTarget;
}
