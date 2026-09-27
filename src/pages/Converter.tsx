import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TestingStandard, RangeValues } from "@/types/range";
import { convertRange } from "@/lib/converter";
import { kmToMiles, milesToKm } from "@/lib/units";
import { formatRange, parseRangeInput } from "@/lib/formatting";
import RangeComparison from "@/components/RangeComparison";
import { ArrowRight, Info, Share2, Check, Minus, Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const STANDARDS: TestingStandard[] = ["NEDC", "WLTP", "CLTC", "EPA"];

export default function Converter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Read from URL, then LocalStorage, then Default
  const [inputValue, setInputValue] = useState<string>(() => searchParams.get("v") || localStorage.getItem("lastRangeValue") || "500");
  const [inputUnit, setInputUnit] = useState<"km" | "mi">(() => (searchParams.get("u") as "km" | "mi") || (localStorage.getItem("lastRangeUnit") as "km" | "mi") || "km");
  const [inputStandard, setInputStandard] = useState<TestingStandard>(() => (searchParams.get("s") as TestingStandard) || (localStorage.getItem("lastRangeStandard") as TestingStandard) || "NEDC");
  
  const [results, setResults] = useState<RangeValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [conditions, setConditions] = useState({
    winter: false,
    highway: false,
    ac: false,
    mountains: false
  });

  // Auto-convert on mount if URL params exist
  useEffect(() => {
    if (searchParams.get("v")) {
      handleConvert();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lastRangeValue", inputValue);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("v", inputValue);
    setSearchParams(newParams, { replace: true });
  }, [inputValue, setSearchParams]);

  useEffect(() => {
    localStorage.setItem("lastRangeUnit", inputUnit);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("u", inputUnit);
    setSearchParams(newParams, { replace: true });
  }, [inputUnit, setSearchParams]);

  useEffect(() => {
    localStorage.setItem("lastRangeStandard", inputStandard);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("s", inputStandard);
    setSearchParams(newParams, { replace: true });
  }, [inputStandard, setSearchParams]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConvert = () => {
    const parsed = parseRangeInput(inputValue);
    
    if (parsed === null) {
      setError("Enter a valid range");
      setResults(null);
      return;
    }
    
    if (parsed <= 0) {
      setError("Range must be greater than zero.");
      setResults(null);
      return;
    }

    if (parsed > 5000) {
      setError("Please enter a realistic EV range.");
      setResults(null);
      return;
    }

    setError(null);
    const calculated = convertRange({ value: parsed, from: inputStandard });
    setResults(calculated);
    
    // Smooth scroll down to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const getMultiplier = () => {
    let m = 1.0;
    if (conditions.winter) m *= 0.75;
    if (conditions.highway) m *= 0.85;
    if (conditions.ac) m *= 0.90;
    if (conditions.mountains) m *= 0.80;
    return m;
  };

  const getDisplayValue = (val: number | null, targetUnit: "km" | "mi") => {
    if (val === null) return null;
    let adjustedVal = val * getMultiplier();
    if (inputUnit !== targetUnit) {
      adjustedVal = inputUnit === "km" ? kmToMiles(adjustedVal) : milesToKm(adjustedVal);
    }
    return adjustedVal;
  };

  return (
    <div className="flex flex-col items-center pt-8 md:pt-16 pb-20">
      <div className="text-center max-w-2xl mx-auto mb-12 w-full">
        <div className="flex justify-center mb-6">
          <img src="/EV_range_logo.jpg" alt="RangeConvert Logo" className="w-24 h-24 rounded-[2rem] shadow-2xl border-4 border-card object-cover" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">EV RANGE CONVERTER</h1>
        <p className="text-lg text-muted mb-6">Compare NEDC, WLTP, CLTC and EPA range in seconds.</p>
        
        <button 
          onClick={handleShare}
          className="mx-auto flex items-center justify-center space-x-2 bg-card border border-border px-4 py-2 rounded-xl text-sm text-muted hover:text-foreground hover:border-muted transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-accent" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? "Link Copied!" : "Share Converter"}</span>
        </button>
      </div>

      <div className="w-full max-w-xl mx-auto bg-card rounded-3xl border border-border p-6 md:p-10 shadow-2xl">
        <div className="space-y-8">
          
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-semibold tracking-wider text-muted uppercase">Your Range</label>
              <div className="flex bg-background p-1 rounded-lg border border-border">
                <button 
                  onClick={() => setInputUnit("km")}
                  className={cn("px-3 py-1 text-sm font-medium rounded-md transition-colors", inputUnit === "km" ? "bg-border text-foreground" : "text-muted hover:text-foreground")}
                >
                  km
                </button>
                <button 
                  onClick={() => setInputUnit("mi")}
                  className={cn("px-3 py-1 text-sm font-medium rounded-md transition-colors", inputUnit === "mi" ? "bg-border text-foreground" : "text-muted hover:text-foreground")}
                >
                  mi
                </button>
              </div>
            </div>
            
            <div className="relative flex items-center">
              <button
                onClick={() => {
                  const val = parseInt(inputValue || "0", 10);
                  if (!isNaN(val)) {
                    setInputValue(Math.max(0, val - 10).toString());
                    setError(null);
                  }
                }}
                className="absolute left-4 z-10 p-3 rounded-xl bg-card border border-border text-muted hover:text-foreground hover:border-muted transition-colors active:scale-95"
                aria-label="Decrease range"
              >
                <Minus className="w-6 h-6" />
              </button>

              <input
                type="text"
                value={inputValue}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                className="w-full bg-background border border-border rounded-2xl text-4xl md:text-6xl font-light text-center py-6 px-20 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="0"
              />

              <div className="absolute right-4 z-10 flex items-center gap-2 md:gap-3">
                <span className="text-xl md:text-2xl text-muted font-light pointer-events-none">
                  {inputUnit}
                </span>
                <button
                  onClick={() => {
                    const val = parseInt(inputValue || "0", 10);
                    if (!isNaN(val)) {
                      setInputValue((val + 10).toString());
                      setError(null);
                    }
                  }}
                  className="p-3 rounded-xl bg-card border border-border text-muted hover:text-foreground hover:border-muted transition-colors active:scale-95"
                  aria-label="Increase range"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-2">
              {[300, 400, 500, 600].map(preset => (
                <button
                  key={preset}
                  onClick={() => { setInputValue(preset.toString()); setError(null); }}
                  className="px-3 py-1 text-xs bg-background border border-border rounded-lg text-muted hover:text-foreground hover:border-muted transition-colors"
                >
                  {preset} {inputUnit}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm text-center mt-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Standard Selection */}
          <div className="space-y-4">
            <label className="text-sm font-semibold tracking-wider text-muted uppercase block text-center">Testing Standard</label>
            <div className="grid grid-cols-4 gap-2">
              {STANDARDS.map((std) => (
                <button
                  key={std}
                  onClick={() => setInputStandard(std)}
                  className={cn(
                    "py-3 rounded-xl text-sm font-medium transition-all border",
                    inputStandard === std 
                      ? "bg-border text-foreground border-muted shadow-sm"
                      : "bg-background text-muted border-border hover:border-muted hover:text-foreground"
                  )}
                >
                  {std}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleConvert}
            className="w-full bg-foreground text-background font-semibold text-lg py-4 rounded-2xl hover:bg-white transition-colors flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <span>CONVERT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div 
            ref={resultsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto mt-16 space-y-16 scroll-mt-8"
          >
            {/* Real World Conditions */}
            <div className="bg-card border border-border p-6 md:p-8 rounded-3xl">
              <h3 className="text-sm font-semibold tracking-widest text-muted mb-6 uppercase text-center">Real-World Range Estimator</h3>
              
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setConditions(c => ({ ...c, winter: !c.winter }))}
                  className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors border", conditions.winter ? "bg-accent/10 border-accent text-accent" : "bg-background border-border text-muted hover:border-muted hover:text-foreground")}
                >
                  ❄️ Winter (-10°C)
                </button>
                <button
                  onClick={() => setConditions(c => ({ ...c, highway: !c.highway }))}
                  className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors border", conditions.highway ? "bg-accent/10 border-accent text-accent" : "bg-background border-border text-muted hover:border-muted hover:text-foreground")}
                >
                  🛣️ Highway (120 km/h)
                </button>
                <button
                  onClick={() => setConditions(c => ({ ...c, ac: !c.ac }))}
                  className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors border", conditions.ac ? "bg-accent/10 border-accent text-accent" : "bg-background border-border text-muted hover:border-muted hover:text-foreground")}
                >
                  ❄️ AC ON
                </button>
                <button
                  onClick={() => setConditions(c => ({ ...c, mountains: !c.mountains }))}
                  className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors border", conditions.mountains ? "bg-accent/10 border-accent text-accent" : "bg-background border-border text-muted hover:border-muted hover:text-foreground")}
                >
                  ⛰️ Mountains / Uphill
                </button>
              </div>
            </div>

            {/* Hero EPA Result */}
            <div className="bg-gradient-to-br from-card to-background border border-accent/30 p-8 md:p-12 rounded-[2rem] shadow-[0_0_40px_rgba(0,229,255,0.05)] relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50" />
              
              <h2 className="text-xl font-bold tracking-widest text-accent mb-6 uppercase">EPA Estimate</h2>
              
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="text-7xl md:text-9xl font-bold tracking-tighter text-foreground mb-2 flex items-baseline">
                  {formatRange(getDisplayValue(results.EPA, "km") || 0)}
                  <span className="text-3xl md:text-5xl font-light text-muted ml-4">km</span>
                </div>
                <div className="text-3xl md:text-4xl font-medium text-muted flex items-baseline">
                  {formatRange(getDisplayValue(results.EPA, "mi") || 0)}
                  <span className="text-xl md:text-2xl font-light ml-2">mi</span>
                </div>
              </div>
              
              <p className="text-muted text-sm md:text-base bg-background/50 inline-block px-4 py-2 rounded-full border border-border">
                Based on {formatRange(parseRangeInput(inputValue) || 0)} {inputUnit} {inputStandard}
              </p>
            </div>

            {/* Other Standards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["WLTP", "CLTC", "NEDC"] as TestingStandard[]).map((std) => (
                <div key={std} className="bg-card border border-border p-6 rounded-3xl">
                  <h3 className="text-sm font-semibold tracking-widest text-muted mb-4">{std}</h3>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-foreground">
                      {formatRange(getDisplayValue(results[std], "km") || 0)} <span className="text-lg font-normal text-muted">km</span>
                    </div>
                    <div className="text-xl font-medium text-muted">
                      {formatRange(getDisplayValue(results[std], "mi") || 0)} <span className="text-base font-normal">mi</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Visualization */}
            <div className="bg-card border border-border p-6 md:p-10 rounded-3xl">
              <h3 className="text-sm font-semibold tracking-widest text-muted mb-8 uppercase text-center">How the numbers compare</h3>
              <RangeComparison 
                ranges={{
                  EPA: getDisplayValue(results.EPA, inputUnit),
                  WLTP: getDisplayValue(results.WLTP, inputUnit),
                  CLTC: getDisplayValue(results.CLTC, inputUnit),
                  NEDC: getDisplayValue(results.NEDC, inputUnit),
                }} 
                unit={inputUnit} 
              />
            </div>

            {/* Explanation & Methodology Link */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-sm text-muted space-y-2 mb-4">
                <p className="font-semibold uppercase tracking-wider text-xs">How we got this</p>
                <p>{formatRange(parseRangeInput(inputValue) || 0)} {inputUnit} {inputStandard}</p>
                <p>↓</p>
                <p>Estimated EPA equivalent</p>
                <p>↓</p>
                <p className="text-foreground font-medium">{formatRange(getDisplayValue(results.EPA, inputUnit) || 0)} {inputUnit} EPA</p>
              </div>
              <Link 
                to="/methodology" 
                className="inline-flex items-center space-x-2 text-accent hover:text-[#00B3CC] transition-colors text-sm font-medium group"
              >
                <span>View methodology</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <div className="w-full max-w-4xl mx-auto mt-24 flex gap-3 text-xs md:text-sm text-muted bg-card/50 p-4 md:p-6 rounded-2xl border border-border">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Converted figures are estimates based on empirical relationships between testing standards. They are not official EPA, WLTP, CLTC or NEDC certification values. Actual range varies with speed, temperature, HVAC use, terrain, tyres, load and driving style.
        </p>
      </div>
    </div>
  );
}
