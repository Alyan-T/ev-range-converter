import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { demoVehicles } from "@/data/demoVehicles";
import { Search, MapPin, Heart } from "lucide-react";
import { formatRange } from "@/lib/formatting";
import { convertRange } from "@/lib/converter";


export default function Cars() {
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [bodyFilter, setBodyFilter] = useState("All");
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<"none" | "priceAsc" | "priceDesc" | "rangeAsc" | "rangeDesc">("none");
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteCars");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favoriteCars", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setFavorites(prev => prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]);
  };

  // Get unique brands and body styles
  const brands = ["All", ...Array.from(new Set(demoVehicles.map(car => car.make)))];
  const bodyStyles = ["All", ...Array.from(new Set(demoVehicles.map(car => car.bodyStyle).filter(Boolean)))];

  const filteredCars = demoVehicles
    .filter((car) => {
      const matchesSearch = car.make.toLowerCase().includes(search.toLowerCase()) || 
                            car.model.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = brandFilter === "All" || car.make === brandFilter;
      const matchesBody = bodyFilter === "All" || car.bodyStyle === bodyFilter;
      const matchesFavorites = showFavorites ? favorites.includes(car.id) : true;
      return matchesSearch && matchesBrand && matchesBody && matchesFavorites;
    })
    .sort((a, b) => {
      if (sortBy === "none") {
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        return 0;
      }
      
      if (sortBy === "priceAsc" || sortBy === "priceDesc") {
        const priceA = a.pakistan.pricePkr || 999999999;
        const priceB = b.pakistan.pricePkr || 999999999;
        return sortBy === "priceAsc" ? priceA - priceB : priceB - priceA;
      }
      
      if (sortBy === "rangeAsc" || sortBy === "rangeDesc") {
        const rangeA = a.ranges.WLTP || a.ranges.CLTC || a.ranges.NEDC || a.ranges.EPA || 0;
        const rangeB = b.ranges.WLTP || b.ranges.CLTC || b.ranges.NEDC || b.ranges.EPA || 0;
        return sortBy === "rangeAsc" ? rangeA - rangeB : rangeB - rangeA;
      }
      return 0;
    });

  const togglePriceSort = () => {
    setSortBy(current => current === "priceAsc" ? "priceDesc" : "priceAsc");
  };

  const toggleRangeSort = () => {
    setSortBy(current => current === "rangeDesc" ? "rangeAsc" : "rangeDesc");
  };

  return (
    <div className="pt-8 md:pt-16 pb-20 max-w-4xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="w-8 h-8 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">EVs in Pakistan</h1>
        </div>
        <p className="text-lg text-muted">A verified database of electric vehicles currently available in the Pakistani market.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
        <input
          type="text"
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <button 
          onClick={() => setShowFavorites(!showFavorites)}
          className={`flex items-center space-x-2 border px-4 py-2 rounded-xl text-sm transition-colors ${showFavorites ? "bg-card border-accent text-accent" : "bg-background border-border text-muted hover:border-muted"}`}
        >
          <Heart className={`w-4 h-4 ${showFavorites ? "fill-current" : ""}`} />
          <span>Favorites</span>
        </button>
        <div className="flex bg-card border border-border rounded-xl overflow-hidden">
          <span className="px-3 py-2 text-sm text-muted bg-background border-r border-border">Brand</span>
          <select 
            value={brandFilter} 
            onChange={(e) => setBrandFilter(e.target.value)}
            className="bg-card text-sm text-foreground px-3 py-2 outline-none cursor-pointer"
          >
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="flex bg-card border border-border rounded-xl overflow-hidden">
          <span className="px-3 py-2 text-sm text-muted bg-background border-r border-border">Body</span>
          <select 
            value={bodyFilter} 
            onChange={(e) => setBodyFilter(e.target.value)}
            className="bg-card text-sm text-foreground px-3 py-2 outline-none cursor-pointer"
          >
            {bodyStyles.map(b => <option key={b as string} value={b as string}>{b}</option>)}
          </select>
        </div>

        <button 
          onClick={togglePriceSort}
          className={`border px-4 py-2 rounded-xl text-sm transition-colors ${sortBy.startsWith("price") ? "bg-card border-accent text-accent" : "bg-background border-border text-muted hover:border-muted"}`}
        >
          Price {sortBy === "priceAsc" ? "↑" : sortBy === "priceDesc" ? "↓" : "↕"}
        </button>

        <button 
          onClick={toggleRangeSort}
          className={`border px-4 py-2 rounded-xl text-sm transition-colors ${sortBy.startsWith("range") ? "bg-card border-accent text-accent" : "bg-background border-border text-muted hover:border-muted"}`}
        >
          Range {sortBy === "rangeAsc" ? "↑" : sortBy === "rangeDesc" ? "↓" : "↕"}
        </button>

        {(search !== "" || brandFilter !== "All" || bodyFilter !== "All" || sortBy !== "none") && (
          <button 
            onClick={() => {
              setSearch("");
              setBrandFilter("All");
              setBodyFilter("All");
              setSortBy("none");
            }}
            className="border border-red-500/30 text-red-400 bg-red-500/5 px-4 py-2 rounded-xl text-sm hover:bg-red-500/10 transition-colors ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCars.map((car) => {
          // Find the primary certified range to use for calculation
          let primaryVal = 0;
          let primaryStd: "WLTP" | "CLTC" | "NEDC" | "EPA" = "WLTP";
          
          if (car.ranges.WLTP) { primaryVal = car.ranges.WLTP; primaryStd = "WLTP"; }
          else if (car.ranges.CLTC) { primaryVal = car.ranges.CLTC; primaryStd = "CLTC"; }
          else if (car.ranges.NEDC) { primaryVal = car.ranges.NEDC; primaryStd = "NEDC"; }
          else if (car.ranges.EPA) { primaryVal = car.ranges.EPA; primaryStd = "EPA"; }

          const calculated = primaryVal > 0 ? convertRange({ value: primaryVal, from: primaryStd }) : null;

          return (
            <Link
              key={car.id}
              to={`/cars/${car.id}`}
              className="flex flex-col justify-between bg-card border border-border rounded-3xl p-6 hover:border-muted transition-all hover:-translate-y-1 overflow-hidden"
            >
              <div>
                <div className="w-full h-48 mb-6 rounded-2xl bg-muted/20 relative overflow-hidden flex items-center justify-center border border-border">
                  <img 
                    src={car.image || `https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80`} 
                    alt={`${car.make} ${car.model}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {!car.image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4 pointer-events-none">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted opacity-60">Placeholder Image</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-bold text-foreground">{car.make} {car.model}</h2>
                      {car.isHot && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20">
                          🔥 Hot
                        </span>
                      )}
                    </div>
                    <p className="text-muted text-sm mt-1">{car.variant || car.trim}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={(e) => toggleFavorite(e, car.id)}
                      className={`p-2 rounded-full hover:bg-background transition-colors ${favorites.includes(car.id) ? "text-red-500" : "text-muted"}`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(car.id) ? "fill-current" : ""}`} />
                    </button>
                    {car.pakistan.priceFormatted && (
                      <span className="text-sm font-bold bg-background text-accent px-3 py-1.5 rounded-xl border border-border">
                        {car.pakistan.priceFormatted}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  {primaryVal > 0 && (
                    <div className="text-lg text-foreground font-medium">
                      {formatRange(primaryVal)} km {primaryStd}
                    </div>
                  )}
                  {calculated && primaryStd !== "EPA" && (
                    <div className="text-muted text-sm">
                      ≈ {formatRange(calculated.EPA || 0)} km EPA equivalent
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-border flex items-center justify-between text-sm text-muted group">
                <span>View Range Details</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 text-center text-sm text-muted">
        Vehicle images and some pricing data sourced from <a href="https://www.pakwheels.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">PakWheels.com</a>
      </div>
    </div>
  );
}
