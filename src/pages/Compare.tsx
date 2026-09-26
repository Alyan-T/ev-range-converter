import { useState, useEffect } from "react";
import { TestingStandard, RangeValues } from "@/types/range";
import { convertRange } from "@/lib/converter";
import { formatRange, parseRangeInput } from "@/lib/formatting";
import RangeComparison from "@/components/RangeComparison";

export default function Compare() {
  const [inputValue, setInputValue] = useState<string>(() => localStorage.getItem("lastRangeValue") || "500");
  const [inputUnit, setInputUnit] = useState<"km" | "mi">(() => (localStorage.getItem("lastRangeUnit") as "km" | "mi") || "km");
  const [inputStandard, setInputStandard] = useState<TestingStandard>(() => (localStorage.getItem("lastRangeStandard") as TestingStandard) || "NEDC");
  const [results, setResults] = useState<RangeValues>(convertRange({ value: parseRangeInput(localStorage.getItem("lastRangeValue") || "500") || 500, from: (localStorage.getItem("lastRangeStandard") as TestingStandard) || "NEDC" }));

  useEffect(() => {
    localStorage.setItem("lastRangeValue", inputValue);
  }, [inputValue]);

  useEffect(() => {
    localStorage.setItem("lastRangeUnit", inputUnit);
  }, [inputUnit]);

  useEffect(() => {
    localStorage.setItem("lastRangeStandard", inputStandard);
  }, [inputStandard]);

  const handleUpdate = () => {
    const parsed = parseRangeInput(inputValue);
    if (parsed !== null && parsed > 0 && parsed <= 5000) {
      setResults(convertRange({ value: parsed, from: inputStandard }));
    }
  };

  return (
    <div className="pt-8 md:pt-16 pb-20 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Compare Standards</h1>
        <p className="text-lg text-muted">See how the same vehicle scores across different testing cycles.</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 md:p-10 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="w-full md:w-1/3">
            <label className="text-sm font-semibold tracking-wider text-muted uppercase mb-2 block">Value</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleUpdate}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              className="w-full bg-background border border-border rounded-xl text-xl p-4 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="text-sm font-semibold tracking-wider text-muted uppercase mb-2 block">Standard</label>
            <select
              value={inputStandard}
              onChange={(e) => {
                const newStd = e.target.value as TestingStandard;
                setInputStandard(newStd);
                const parsed = parseRangeInput(inputValue);
                if (parsed) setResults(convertRange({ value: parsed, from: newStd }));
              }}
              className="w-full bg-background border border-border rounded-xl text-xl p-4 focus:outline-none focus:border-accent transition-colors appearance-none"
            >
              <option value="NEDC">NEDC</option>
              <option value="WLTP">WLTP</option>
              <option value="CLTC">CLTC</option>
              <option value="EPA">EPA</option>
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <label className="text-sm font-semibold tracking-wider text-muted uppercase mb-2 block">Unit</label>
            <div className="flex bg-background p-1 rounded-xl border border-border h-[62px] items-center px-1">
              <button 
                onClick={() => setInputUnit("km")}
                className={`flex-1 h-full rounded-lg transition-colors font-medium ${inputUnit === "km" ? "bg-border text-foreground" : "text-muted"}`}
              >
                km
              </button>
              <button 
                onClick={() => setInputUnit("mi")}
                className={`flex-1 h-full rounded-lg transition-colors font-medium ${inputUnit === "mi" ? "bg-border text-foreground" : "text-muted"}`}
              >
                mi
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border p-6 md:p-12 rounded-3xl">
        <div className="text-center mb-10">
          <div className="text-3xl font-light text-foreground">
            {formatRange(parseRangeInput(inputValue) || 0)} {inputUnit} {inputStandard}
          </div>
          <div className="text-muted mt-2">is approximately equal to</div>
        </div>
        
        <RangeComparison ranges={results} unit={inputUnit} />
      </div>
    </div>
  );
}
