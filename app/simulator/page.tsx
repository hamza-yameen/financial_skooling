import React from "react";
import RiskSimulator from "@/components/RiskSimulator";
import { Cpu, ShieldCheck, TrendingUp, AlertTriangle, HelpCircle, BookOpen } from "lucide-react";

export const metadata = {
  title: "Quantitative Risk & Drawdown Engine — Financial Skool",
  description:
    "Simulate sequence-of-returns volatility, Monte Carlo equity trajectories, Fractional Kelly Criterion, and risk-of-ruin envelopes with zero real money risk.",
};

export default function SimulatorPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background ambient blooms */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[450px] bg-[#8B9B6D]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-[#BAC8A1]/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B9B6D]/10 border border-[#8B9B6D]/30 text-xs font-mono font-bold text-[#384524] uppercase tracking-widest shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-[#5C6E42]" />
            QUANTITATIVE EXECUTION UTILITY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1C2417]">
            Risk & <span className="text-gradient-primary">Drawdown Engine</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4A5836] leading-relaxed font-medium">
            The difference between disciplined financial strategy and emotional speculation is mathematical discipline. Adjust parameters below to run real-time Monte Carlo simulations.
          </p>
        </div>

        {/* Simulator Component */}
        <RiskSimulator compact={false} />

        {/* Mathematical Reference Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-white border border-[#EBE2D6] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#5C6E42] font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-[#5C6E42]" />
              Expected Value (EV) Formula
            </div>
            <p className="text-xs text-[#4A5836] leading-relaxed font-medium">
              <code className="text-[#384524] font-mono bg-[#8B9B6D]/15 px-1.5 py-0.5 rounded">EV = (Win% × Reward) - (Loss% × Risk)</code>. In institutional trading, a setup with negative
              EV is strictly prohibited, regardless of short-term discretionary sentiment.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EBE2D6] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#5C6E42] font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-[#5C6E42]" />
              Quarter-Kelly Sizing
            </div>
            <p className="text-xs text-[#4A5836] leading-relaxed font-medium">
              Full Kelly sizing maximizes geometric growth rate but produces excruciating peak-to-trough
              drawdowns. Financial Skool teaches Quarter-Kelly (0.25 × f*) to buffer against regime
              shifts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EBE2D6] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Ruin Probability Dynamics
            </div>
            <p className="text-xs text-[#4A5836] leading-relaxed font-medium">
              With risk exceeding 3% per position, sequence-of-returns clustering creates a non-zero
              probability of catastrophic account wipeout during normal 6 to 9 trade losing streaks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
