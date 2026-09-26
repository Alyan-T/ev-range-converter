import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="pt-8 md:pt-16 pb-20 max-w-3xl mx-auto text-center">
      <div className="flex justify-center mb-8">
        <div className="bg-card p-4 rounded-2xl border border-border">
          <Zap className="w-10 h-10 text-accent" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About RangeConvert</h1>
      
      <p className="text-xl text-muted leading-relaxed mb-12 max-w-2xl mx-auto">
        We built this tool because comparing EV ranges across global markets is unnecessarily confusing. A 500km car in one country might be a 400km car in another.
      </p>

      <div className="bg-card border border-border p-8 md:p-12 rounded-3xl text-left max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-foreground mb-4">Our Mission</h2>
        <p className="text-muted mb-8">
          To provide the most accurate, premium, and user-friendly range conversion experience. We want to help buyers understand true vehicle capability regardless of where the car was tested.
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4">Future Roadmap</h2>
        <ul className="space-y-3 text-muted list-disc list-inside mb-8">
          <li>Live vehicle database with official ratings</li>
          <li>Vehicle-specific aerodynamic conversion modeling</li>
          <li>Highway vs City split calculations</li>
          <li>Cold weather range degradation estimates</li>
        </ul>

        <Link 
          to="/" 
          className="inline-block bg-foreground text-background font-semibold px-8 py-3 rounded-xl hover:bg-white transition-colors"
        >
          Try the Converter
        </Link>
      </div>
    </div>
  );
}
