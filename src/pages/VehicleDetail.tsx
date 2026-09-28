import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { demoVehicles } from "@/data/demoVehicles";
import { formatRange } from "@/lib/formatting";
import RangeComparison from "@/components/RangeComparison";
import { ArrowLeft, Flag, CheckCircle2, Heart } from "lucide-react";
import { convertRange } from "@/lib/converter";

export default function VehicleDetail() {
  const { id } = useParams();
  const car = demoVehicles.find((v) => v.id === id);
  const [isReporting, setIsReporting] = useState(false);
  const [isReported, setIsReported] = useState(false);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteCars");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favoriteCars", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = () => {
    if (!car) return;
    setFavorites(prev => prev.includes(car.id) ? prev.filter(fId => fId !== car.id) : [...prev, car.id]);
  };

  if (!car) {
    return (
      <div className="pt-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
        <Link to="/cars" className="text-accent hover:underline">Return to database</Link>
      </div>
    );
  }

  // Calculate full ranges based on best available cert
  let primaryVal = 0;
  let primaryStd: "WLTP" | "CLTC" | "NEDC" | "EPA" = "WLTP";
  
  if (car.ranges.WLTP) { primaryVal = car.ranges.WLTP; primaryStd = "WLTP"; }
  else if (car.ranges.CLTC) { primaryVal = car.ranges.CLTC; primaryStd = "CLTC"; }
  else if (car.ranges.NEDC) { primaryVal = car.ranges.NEDC; primaryStd = "NEDC"; }
  else if (car.ranges.EPA) { primaryVal = car.ranges.EPA; primaryStd = "EPA"; }

  const fullRanges = primaryVal > 0 ? convertRange({ value: primaryVal, from: primaryStd }) : car.ranges;

  // We map the official vs estimated ranges for display
  const getDisplayRange = (std: "WLTP" | "CLTC" | "NEDC" | "EPA") => {
    const isOfficial = car.ranges[std] !== null && car.ranges[std] !== undefined;
    const value = isOfficial ? car.ranges[std] : fullRanges[std];
    return { value, isOfficial };
  };

  return (
    <div className="pt-8 md:pt-16 pb-20 max-w-4xl mx-auto">
      <Link to="/cars" className="inline-flex items-center space-x-2 text-muted hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Pakistan EVs</span>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">{car.make} {car.model}</h1>
            <button 
              onClick={toggleFavorite}
              aria-label="Toggle Favorite"
              className={`p-3 rounded-full border border-border hover:bg-card transition-colors ${favorites.includes(car.id) ? "text-red-500 bg-red-500/10 border-red-500/30" : "text-muted bg-background"}`}
            >
              <Heart className={`w-6 h-6 ${favorites.includes(car.id) ? "fill-current" : ""}`} />
            </button>
          </div>
          <p className="text-xl text-muted mt-2">{car.year} • {car.variant || car.trim}</p>
        </div>
        
        <div className="mt-6 md:mt-0 flex gap-4">
          <div className="bg-card border border-border px-6 py-3 rounded-2xl text-center">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Battery</p>
            <p className="text-xl font-bold text-foreground">{car.batteryKwh} kWh</p>
          </div>
          {car.pakistan.priceFormatted && (
            <div className="bg-card border border-border px-6 py-3 rounded-2xl text-center">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Price</p>
              <p className="text-xl font-bold text-accent">{car.pakistan.priceFormatted}</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-64 md:h-96 mb-12 rounded-[2rem] bg-muted/20 relative overflow-hidden border border-border flex items-center justify-center shadow-xl">
        <img 
          src={car.image || `https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80`} 
          alt={`${car.make} ${car.model}`} 
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        {!car.image && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-6 pointer-events-none">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted opacity-60">Placeholder Image</span>
          </div>
        )}
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Range Specifications</h2>
          
          <div className="flex items-center space-x-4 text-xs text-muted">
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-accent" />
              <span>Official</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full border border-muted border-dashed" />
              <span>Estimated</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(["EPA", "WLTP", "CLTC", "NEDC"] as const).map((std) => {
            const { value, isOfficial } = getDisplayRange(std);
            const isEPA = std === "EPA";
            
            return (
              <div key={std} className={`p-6 rounded-3xl border relative ${isOfficial ? 'bg-card' : 'bg-background'} ${isEPA && isOfficial ? "border-accent/50 shadow-[0_0_20px_rgba(0,229,255,0.05)]" : "border-border"}`}>
                {isOfficial && (
                  <CheckCircle2 className={`absolute top-4 right-4 w-4 h-4 ${isEPA ? 'text-accent' : 'text-muted'}`} />
                )}
                <h3 className={`text-sm font-semibold tracking-widest mb-4 ${isEPA ? "text-accent" : "text-muted"}`}>{std}</h3>
                
                {value !== null ? (
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {isOfficial ? "" : "~"}{formatRange(value)} <span className="text-sm font-normal text-muted">km</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-border">—</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border p-6 md:p-10 rounded-3xl mb-8">
        <h3 className="text-sm font-semibold tracking-widest text-muted mb-8 uppercase">Range Visualization</h3>
        {/* We use fullRanges so the visualization includes both official and estimated values */}
        <RangeComparison ranges={fullRanges as any} unit="km" />
        
                {isReported ? (
          <div className="flex items-center space-x-2 text-realism-accent bg-realism-accent/10 px-4 py-2 rounded-lg border border-realism-accent/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>Report submitted</span>
          </div>
        ) : isReporting ? (
          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <input type="text" placeholder="What's wrong? (e.g. WLTP is 530)" className="bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-accent text-foreground text-sm" />
            <div className="flex gap-2">
              <button onClick={() => setIsReported(true)} className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 text-sm">Submit</button>
              <button onClick={() => setIsReporting(false)} className="bg-card border border-border px-4 py-2 rounded-lg hover:bg-border text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsReporting(true)}
            className="flex items-center space-x-2 text-muted hover:text-warning transition-colors bg-card px-4 py-2 rounded-lg border border-border hover:border-warning/50"
          >
            <Flag className="w-4 h-4" />
            <span>Report incorrect data</span>
          </button>
        )}
      </div>

      {/* Verification Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-background border border-border p-4 rounded-xl text-sm text-muted">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 sm:mb-0">
          <p><span className="font-semibold text-foreground">Source:</span> {car.source}</p>
          <p><span className="font-semibold text-foreground">Verified:</span> {car.lastVerified}</p>
        </div>
        
        {(() => {
          const [isReporting, setIsReporting] = useState(false);
          const [isReported, setIsReported] = useState(false);

          if (isReported) {
            return (
              <div className="flex items-center space-x-2 text-realism-accent bg-realism-accent/10 px-4 py-2 rounded-lg border border-realism-accent/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Report submitted</span>
              </div>
            );
          }

          if (isReporting) {
            return (
              <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
                <input type="text" placeholder="What's wrong? (e.g. WLTP is 530)" className="bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-accent text-foreground" />
                <div className="flex gap-2">
                  <button onClick={() => setIsReported(true)} className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:opacity-90">Submit</button>
                  <button onClick={() => setIsReporting(false)} className="bg-card border border-border px-4 py-2 rounded-lg hover:bg-border">Cancel</button>
                </div>
              </div>
            );
          }

          return (
            <button 
              onClick={() => setIsReporting(true)}
              className="flex items-center space-x-2 text-muted hover:text-warning transition-colors bg-card px-4 py-2 rounded-lg border border-border hover:border-warning/50"
            >
              <Flag className="w-4 h-4" />
              <span>Report incorrect data</span>
            </button>
          );
        })()}
      </div>

    </div>
  );
}
