import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <span className="font-bold text-lg">RangeConvert</span>
            </Link>
            <p className="text-muted text-sm">
              EV range conversion, simplified.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted">
            <Link to="/" className="hover:text-foreground transition-colors">Converter</Link>
            <Link to="/compare" className="hover:text-foreground transition-colors">Compare</Link>
            <Link to="/cars" className="hover:text-foreground transition-colors">Cars</Link>
            <Link to="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-sm text-muted flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} RangeConvert</p>
          <p>Built by <span className="text-foreground font-semibold tracking-wide">HyperSoft</span></p>
          <p>Not an official certification tool.</p>
        </div>
      </div>
    </footer>
  );
}
