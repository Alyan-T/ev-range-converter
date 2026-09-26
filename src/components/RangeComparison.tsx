import { TestingStandard } from "@/types/range";
import { motion } from "framer-motion";
import { formatRange } from "@/lib/formatting";

interface RangeComparisonProps {
  ranges: Record<TestingStandard, number | null>;
  unit: string;
}

export default function RangeComparison({ ranges, unit }: RangeComparisonProps) {
  // Find max value to calculate percentage width
  const maxRange = Math.max(...Object.values(ranges).filter((v): v is number => v !== null));

  // Order by typically highest to lowest for better visual cascade
  const standards: TestingStandard[] = ["CLTC", "NEDC", "WLTP", "EPA"];

  return (
    <div className="w-full space-y-6">
      {standards.map((std, index) => {
        const val = ranges[std];
        if (val === null) return null;
        
        const percentage = Math.max((val / maxRange) * 100, 5); // min width 5%
        const isEPA = std === "EPA";

        return (
          <div key={std} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="w-16 flex-shrink-0 font-medium text-sm sm:text-base text-muted">
              {std}
            </div>
            <div className="flex-1 flex items-center gap-3">
              <div className="h-8 flex-1 bg-card rounded-full overflow-hidden border border-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full ${
                    isEPA ? "bg-accent shadow-[0_0_15px_rgba(0,229,255,0.3)]" : "bg-border"
                  }`}
                />
              </div>
              <div className={`w-20 text-right font-medium ${isEPA ? "text-accent" : "text-foreground"}`}>
                {formatRange(val)} {unit}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
