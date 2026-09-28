export default function Methodology() {
  return (
    <div className="pt-8 md:pt-16 pb-20 max-w-3xl mx-auto">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Methodology</h1>
        <p className="text-xl text-muted leading-relaxed">
          Understanding the difference between EV testing standards and why EPA represents the most realistic everyday range.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">EPA</h2>
            <span className="bg-card border border-border text-xs uppercase tracking-wider text-accent px-3 py-1 rounded-full">Most Realistic</span>
          </div>
          <div className="prose prose-invert max-w-none text-muted">
            <p className="mb-4">
              The United States Environmental Protection Agency (EPA) testing cycle is widely considered the most stringent and realistic of the major global standards. It includes aggressive acceleration, high-speed highway driving, and requires testing with climate control systems operating.
            </p>
            <p>
              Why you should care: EPA figures usually provide the best estimate of what you will actually achieve in mixed driving conditions. It is not a simple mathematical formula from other standards; it is based on physical vehicle testing.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">WLTP</h2>
            <span className="bg-card border border-border text-xs uppercase tracking-wider text-muted px-3 py-1 rounded-full">Global Standard</span>
          </div>
          <div className="prose prose-invert max-w-none text-muted">
            <p className="mb-4">
              The Worldwide Harmonised Light Vehicle Test Procedure (WLTP) replaced the outdated NEDC standard in Europe. It involves a longer test cycle, higher average and maximum speeds, and more dynamic driving phases.
            </p>
            <p>
              Why you should care: WLTP is significantly more accurate than NEDC, but it often still produces range figures that are 10-20% higher than what most drivers experience in real-world highway driving or cold weather.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">CLTC</h2>
            <span className="bg-card border border-border text-xs uppercase tracking-wider text-muted px-3 py-1 rounded-full">China Specific</span>
          </div>
          <div className="prose prose-invert max-w-none text-muted">
            <p className="mb-4">
              The China Light-Duty Vehicle Test Cycle (CLTC) is tailored specifically for Chinese driving conditions, which heavily feature stop-and-go urban traffic and lower average speeds.
            </p>
            <p>
              Why you should care: Because EVs are highly efficient at low speeds, the CLTC generally yields the highest range figures of all current testing standards. A CLTC range is extremely difficult to replicate in Western highway driving.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">NEDC</h2>
            <span className="bg-card border border-border text-xs uppercase tracking-wider text-muted px-3 py-1 rounded-full">Legacy</span>
          </div>
          <div className="prose prose-invert max-w-none text-muted">
            <p className="mb-4">
              The New European Driving Cycle (NEDC) is a legacy testing standard designed in the 1980s. It features highly theoretical, gentle acceleration and low average speeds.
            </p>
            <p>
              Why you should care: NEDC is notorious for producing highly optimistic range figures. It has mostly been phased out globally in favor of WLTP, but remains useful for historical comparisons of older vehicles.
            </p>
          </div>
        </section>

        <div className="bg-card border border-border p-8 rounded-3xl mt-12">
          <h3 className="text-xl font-bold text-foreground mb-4">How our converter works</h3>
          <p className="text-muted text-sm leading-relaxed mb-4">
            VoltRange uses empirical coefficients derived from analyzing EVs that have been officially certified under multiple testing cycles. However, aerodynamic drag, vehicle mass, and drivetrain efficiency scale differently across these test cycles.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Therefore, a single universal mathematical multiplier cannot perfectly convert between standards for every vehicle. Our tool provides the closest approximate baseline, but official certification figures should always be consulted for final purchasing decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
