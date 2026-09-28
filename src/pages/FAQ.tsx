import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";


const faqs = [
  {
    question: "Why is CLTC range always so much higher than real life?",
    answer: "The China Light-Duty Vehicle Test Cycle (CLTC) is highly optimistic because it is weighted heavily toward slow, urban driving in stop-and-go traffic. EVs are highly efficient at low speeds due to regenerative braking. The CLTC test also involves very gentle acceleration, long idle times, and zero high-speed highway segments, which drastically inflates the resulting range figure compared to real-world driving."
  },
  {
    question: "What is the difference between WLTP and EPA?",
    answer: "WLTP (Worldwide Harmonised Light Vehicles Test Procedure) is the global standard used in Europe and Asia. It is dynamic and tests a mix of city and highway speeds, but usually at a moderate 23°C (73°F) without heavy climate control. The EPA (US Environmental Protection Agency) test is much stricter, testing higher sustained highway speeds, aggressive acceleration, and applying a mandatory 0.70x reduction multiplier to simulate imperfect real-world conditions like harsh weather and AC usage. As a result, EPA is usually 11-15% lower than WLTP."
  },
  {
    question: "How does cold weather affect my EV range?",
    answer: "Cold weather (around 0°C / 32°F) can reduce an EV's range by 20% to 30%. This happens for two main reasons: the chemical reactions inside lithium-ion batteries slow down, temporarily reducing their capacity, and EVs must use electricity from the battery to heat both the cabin and the battery pack itself. Preconditioning your car while it's still plugged in can significantly reduce this penalty."
  },
  {
    question: "Why does highway driving drain the battery faster than city driving?",
    answer: "Unlike gas cars, EVs are less efficient on the highway. Aerodynamic drag increases quadratically with speed, meaning driving at 120 km/h (75 mph) requires significantly more energy to push through the air than driving at 80 km/h (50 mph). Additionally, highway driving involves constant acceleration without the benefit of regenerative braking found in stop-and-go city traffic."
  },
  {
    question: "Are the conversion figures on this site 100% accurate?",
    answer: "No. The conversions provided by VoltRange are highly accurate mathematical estimates based on empirical testing data and known regulatory multipliers (e.g., WLTP * 0.88 ≈ EPA). However, exact conversions vary by vehicle depending on aerodynamics, weight, battery chemistry, and motor type. Always refer to official certification data for precise figures."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generate FAQ Schema for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Inject SEO Schema safely */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="text-center mb-12 space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
            <HelpCircle className="w-8 h-8 text-accent" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">Frequently Asked Questions</h1>
        <p className="text-muted text-lg">Everything you need to know about EV range testing and real-world performance.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className={cn(
                "border border-border bg-card rounded-2xl overflow-hidden transition-all duration-300",
                isOpen ? "ring-1 ring-accent/50 shadow-[0_0_15px_rgba(0,242,254,0.05)]" : "hover:border-muted/50"
              )}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={cn(
                  "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "max-h-[500px] opacity-100 pb-5" : "max-h-0 opacity-0 pb-0"
                )}
              >
                <div className="h-px w-full bg-border mb-4" />
                <p className="text-muted leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
