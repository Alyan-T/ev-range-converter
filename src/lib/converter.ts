import { ConversionInput, RangeValues, TestingStandard } from "@/types/range";
import { getConversionFactor } from "@/data/conversionFactors";

export function convertRange(input: ConversionInput): RangeValues {
  const { value, from } = input;
  
  const standards: TestingStandard[] = ["NEDC", "WLTP", "CLTC", "EPA"];
  
  const result = {} as RangeValues;
  
  standards.forEach((std) => {
    if (std === from) {
      result[std] = value;
    } else {
      const factor = getConversionFactor(from, std);
      result[std] = value * factor;
    }
  });

  return result;
}
