export function formatRange(value: number): string {
  // Round to nearest integer for clean display
  return Math.round(value).toLocaleString("en-US");
}

export function parseRangeInput(input: string): number | null {
  const parsed = parseFloat(input.replace(/,/g, ""));
  if (isNaN(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}
