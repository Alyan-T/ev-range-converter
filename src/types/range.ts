export type TestingStandard = "NEDC" | "WLTP" | "CLTC" | "EPA";
export type Unit = "km" | "mi";

export interface RangeValues {
  NEDC: number | null;
  WLTP: number | null;
  CLTC: number | null;
  EPA: number | null;
}

export interface ConversionInput {
  value: number;
  from: TestingStandard;
}
