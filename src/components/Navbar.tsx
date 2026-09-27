import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Calculator, BarChart2, Car, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Convert", path: "/", icon: Calculator },
  { name: "Compare", path: "/compare", icon: BarChart2 },
  { name: "Vehicles", path: "/cars", icon: Car },
  { name: "Standards", path: "/methodology", icon: BookOpen },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-card p-1.5 rounded-xl group-hover:bg-border transition-colors border border-border flex items-center justify-center">
                <img src="/EV_range_logo.jpg" alt="RangeConvert Logo" className="w-8 h-8 object-cover rounded-lg" />
              </div>
              <span className="font-bold text-xl tracking-tight">VoltRange</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "bg-card text-accent border border-border shadow-[0_0_10px_rgba(0,242,254,0.1)]"
                      : "text-muted hover:text-foreground hover:bg-card"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pl-4 ml-4 border-l border-border">
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-muted hover:text-foreground hover:bg-card transition-colors"
                  aria-label="Toggle Theme"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Theme Toggle */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleTheme}
                className="p-2 text-muted hover:text-foreground transition-colors rounded-full"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation (Kinetic Arc) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-border z-50 px-2 pb-safe pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center h-14">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all",
                  isActive ? "text-accent" : "text-muted hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                  {isActive && (
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent shadow-[0_0_8px_rgba(0,242,254,0.8)]" />
                  )}
                </div>
                <span className={cn("text-[10px] font-medium", isActive ? "font-bold tracking-wide" : "")}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
