"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Percent,
  Sliders,
  Shield,
  Zap,
} from "lucide-react";

// Deterministic Mulberry32 Pseudo-Random Number Generator
// Guarantees identical sequence on both Server SSR and Client Hydration
function createPRNG(seed: number) {
  let s = (seed >>> 0) || 1;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function RiskSimulator({ compact = false }: { compact?: boolean }) {
  // Inputs
  const [initialCapital, setInitialCapital] = useState<number>(25000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [winRate, setWinRate] = useState<number>(52);
  const [rewardRisk, setRewardRisk] = useState<number>(2.0);
  const [tradeCount, setTradeCount] = useState<number>(compact ? 50 : 100);
  const [seed, setSeed] = useState<number>(42);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Re-run simulation deterministically on client click
  const handleRegenerate = () => {
    setSeed((prev) => (prev * 1664525 + 1013904223) >>> 0 || 1);
  };

  // Calculations
  const simulation = useMemo(() => {
    const p = winRate / 100;
    const b = rewardRisk;
    const r = riskPercent / 100;

    // Mathematical Expected Value (EV in R units)
    const expectedValueR = p * b - (1 - p) * 1.0;
    const expectedValueEuro = expectedValueR * (initialCapital * r);

    // Full Kelly Criterion
    const kelly = b > 0 ? (p * (b + 1) - 1) / b : 0;
    const recommendedQuarterKelly = Math.max(0, kelly * 25); // as percentage

    // Max expected consecutive losses over N trades: ~ ln(N) / -ln(1 - p)
    const expectedMaxLosingStreak = Math.round(Math.log(tradeCount) / -Math.log(1 - p));

    // Monte Carlo sequence generation with deterministic PRNG
    const prng = createPRNG(seed);
    const equityCurve: number[] = [initialCapital];
    let currentEquity = initialCapital;
    let peakEquity = initialCapital;
    let maxDrawdownEuro = 0;
    let maxDrawdownPercent = 0;
    let wins = 0;
    let losses = 0;

    for (let i = 1; i <= tradeCount; i++) {
      const rand = prng();
      const isWin = rand < p;
      const riskAmount = currentEquity * r;

      if (isWin) {
        wins++;
        currentEquity += riskAmount * b;
      } else {
        losses++;
        currentEquity -= riskAmount;
      }

      if (currentEquity > peakEquity) {
        peakEquity = currentEquity;
      }

      const drawdownEuro = peakEquity - currentEquity;
      const drawdownPct = peakEquity > 0 ? (drawdownEuro / peakEquity) * 100 : 0;

      if (drawdownPct > maxDrawdownPercent) {
        maxDrawdownPercent = drawdownPct;
        maxDrawdownEuro = drawdownEuro;
      }

      equityCurve.push(Math.round(currentEquity));
    }

    const netProfit = currentEquity - initialCapital;
    const netReturnPercent = ((currentEquity - initialCapital) / initialCapital) * 100;

    // Risk Evaluation Status
    let riskStatus: "OPTIMAL" | "CAUTION" | "HAZARDOUS" = "OPTIMAL";
    let statusMessage = "Disciplined risk envelope with positive statistical expectancy.";

    if (expectedValueR <= 0) {
      riskStatus = "HAZARDOUS";
      statusMessage = "Negative expectancy! Strategy will mathematically guarantee portfolio loss over time.";
    } else if (riskPercent > recommendedQuarterKelly && recommendedQuarterKelly > 0) {
      riskStatus = "CAUTION";
      statusMessage = `Risk per trade (${riskPercent}%) exceeds Quarter-Kelly recommendation (${recommendedQuarterKelly.toFixed(1)}%). Elevated drawdown risk.`;
    } else if (maxDrawdownPercent > 18) {
      riskStatus = "CAUTION";
      statusMessage = "Drawdown peak exceeded 18%. Consider scaling risk down to 1.0% or tightening invalidation.";
    }

    return {
      expectedValueR,
      expectedValueEuro,
      recommendedQuarterKelly,
      expectedMaxLosingStreak,
      equityCurve,
      finalEquity: Math.round(currentEquity),
      peakEquity: Math.round(peakEquity),
      maxDrawdownPercent: Math.round(maxDrawdownPercent * 10) / 10,
      maxDrawdownEuro: Math.round(maxDrawdownEuro),
      netProfit: Math.round(netProfit),
      netReturnPercent: Math.round(netReturnPercent * 10) / 10,
      wins,
      losses,
      riskStatus,
      statusMessage,
    };
  }, [initialCapital, riskPercent, winRate, rewardRisk, tradeCount, seed]);

  // SVG Chart path calculation
  const chartPoints = useMemo(() => {
    const min = Math.min(...simulation.equityCurve, initialCapital * 0.8);
    const max = Math.max(...simulation.equityCurve, initialCapital * 1.2);
    const range = max - min || 1;

    const width = 600;
    const height = 180;
    const padding = 15;

    const points = simulation.equityCurve.map((val, idx) => {
      const x = padding + (idx / tradeCount) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return {
      polyline: points.join(" "),
      firstPoint: points[0],
      lastPoint: points[points.length - 1],
      min,
      max,
    };
  }, [simulation.equityCurve, initialCapital, tradeCount]);

  return (
    <div className="rounded-3xl bg-white border border-[#EBE2D6] p-6 sm:p-8 shadow-sm relative overflow-hidden">
      {/* Background ambient pastel bloom */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B9B6D]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE2D6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#8B9B6D]/10 border border-[#8B9B6D]/30 text-[#5C6E42]">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-black text-[#1C2417] tracking-tight">
              Monte Carlo Risk & Drawdown Engine
            </h3>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#8B9B6D]/15 text-[#384524] border border-[#8B9B6D]/30">
              v2.4 ⚡
            </span>
          </div>
          <p className="text-xs text-[#4A5836] mt-1 font-medium">
            Simulate portfolio survival, sequence-of-returns volatility, and mathematical ruin probability.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B9B6D]/10 hover:bg-[#8B9B6D]/20 text-xs font-bold text-[#384524] border border-[#8B9B6D]/30 transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#5C6E42]" />
          Re-seed Monte Carlo Run
        </button>
      </div>

      {/* Controls & Metric Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Starting Capital */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#4A5836]">Starting Portfolio Balance</span>
              <span className="font-mono text-[#5C6E42] font-bold" suppressHydrationWarning>
                €{initialCapital.toLocaleString("en-US")}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="250000"
              step="5000"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full h-2 bg-[#EBE2D6] rounded-lg appearance-none cursor-pointer accent-[#5C6E42]"
            />
          </div>

          {/* Risk Per Trade */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#4A5836]">Risk Per Trade</span>
              <span className="font-mono text-[#5C6E42] font-bold" suppressHydrationWarning>
                {riskPercent.toFixed(1)}% (€{Math.round(initialCapital * (riskPercent / 100)).toLocaleString("en-US")})
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full h-2 bg-[#EBE2D6] rounded-lg appearance-none cursor-pointer accent-[#5C6E42]"
            />
          </div>

          {/* Win Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#4A5836]">Historical Win Rate</span>
              <span className="font-mono text-[#5C6E42] font-bold">{winRate}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="80"
              step="1"
              value={winRate}
              onChange={(e) => setWinRate(Number(e.target.value))}
              className="w-full h-2 bg-[#EBE2D6] rounded-lg appearance-none cursor-pointer accent-[#5C6E42]"
            />
          </div>

          {/* Reward to Risk Ratio */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#4A5836]">Reward-to-Risk (R:R)</span>
              <span className="font-mono text-[#5C6E42] font-bold">1 : {rewardRisk.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={rewardRisk}
              onChange={(e) => setRewardRisk(Number(e.target.value))}
              className="w-full h-2 bg-[#EBE2D6] rounded-lg appearance-none cursor-pointer accent-[#5C6E42]"
            />
          </div>

          {!compact && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#4A5836]">Sample Iteration Trades</span>
                <span className="font-mono text-[#5C6E42] font-bold">{tradeCount} Rounds</span>
              </div>
              <input
                type="range"
                min="30"
                max="250"
                step="10"
                value={tradeCount}
                onChange={(e) => setTradeCount(Number(e.target.value))}
                className="w-full h-2 bg-[#EBE2D6] rounded-lg appearance-none cursor-pointer accent-[#5C6E42]"
              />
            </div>
          )}

          {/* Status Alert Banner */}
          <div
            className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition-colors ${
              simulation.riskStatus === "OPTIMAL"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : simulation.riskStatus === "CAUTION"
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {simulation.riskStatus === "OPTIMAL" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-black uppercase tracking-wider block text-[10px]">
                {simulation.riskStatus} ENVELOPE
              </span>
              <p className="mt-0.5 leading-snug font-medium">{simulation.statusMessage}</p>
            </div>
          </div>
        </div>

        {/* Visualizer & Metrics Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Equity Chart Viewport (Sleek High-Contrast Cockpit) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 flex-1 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Simulated Equity Curve ({tradeCount} Iterations)
              </span>
              <span
                suppressHydrationWarning
                className={`font-mono font-bold ${
                  simulation.netProfit >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {simulation.netProfit >= 0 ? "+" : ""}
                {simulation.netReturnPercent}% (€{simulation.finalEquity.toLocaleString("en-US")})
              </span>
            </div>

            {/* SVG Visualizer */}
            <div className="w-full h-44 relative flex items-center justify-center">
              <svg
                viewBox="0 0 600 180"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Baseline */}
                <line
                  x1="15"
                  y1="90"
                  x2="585"
                  y2="90"
                  stroke="rgba(255,255,255,0.12)"
                  strokeDasharray="4 4"
                />

                {/* Curve */}
                <polyline
                  fill="none"
                  stroke={simulation.netProfit >= 0 ? "#10b981" : "#f43f5e"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartPoints.polyline}
                />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span suppressHydrationWarning>Trade #0: €{initialCapital.toLocaleString("en-US")}</span>
              <span suppressHydrationWarning>
                Wins: <strong className="text-emerald-400 font-bold">{simulation.wins}</strong> | Losses:{" "}
                <strong className="text-rose-400 font-bold">{simulation.losses}</strong>
              </span>
              <span suppressHydrationWarning>Final: €{simulation.finalEquity.toLocaleString("en-US")}</span>
            </div>
          </div>

          {/* Key Quant Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6]">
              <span className="text-[10px] text-[#4A5836] uppercase tracking-wider font-bold block">
                EV Per Trade
              </span>
              <p
                suppressHydrationWarning
                className={`text-sm font-bold font-mono mt-0.5 ${
                  simulation.expectedValueR > 0 ? "text-[#384524]" : "text-rose-600"
                }`}
              >
                +{simulation.expectedValueR.toFixed(2)} R
              </p>
              <span className="text-[9px] text-[#4A5836] font-mono" suppressHydrationWarning>
                +€{Math.round(simulation.expectedValueEuro).toLocaleString("en-US")} / trade
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6]">
              <span className="text-[10px] text-[#4A5836] uppercase tracking-wider font-bold block">
                Max Drawdown
              </span>
              <p className="text-sm font-bold font-mono text-amber-700 mt-0.5" suppressHydrationWarning>
                -{simulation.maxDrawdownPercent}%
              </p>
              <span className="text-[9px] text-[#4A5836] font-mono" suppressHydrationWarning>
                -€{simulation.maxDrawdownEuro.toLocaleString("en-US")} peak
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6]">
              <span className="text-[10px] text-[#4A5836] uppercase tracking-wider font-bold block">
                Quarter Kelly
              </span>
              <p className="text-sm font-bold font-mono text-[#5C6E42] mt-0.5" suppressHydrationWarning>
                {simulation.recommendedQuarterKelly.toFixed(1)}%
              </p>
              <span className="text-[9px] text-[#4A5836] font-mono">Theoretical Max</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6]">
              <span className="text-[10px] text-[#4A5836] uppercase tracking-wider font-bold block">
                Max Loss Streak
              </span>
              <p className="text-sm font-bold font-mono text-[#1C2417] mt-0.5" suppressHydrationWarning>
                {simulation.expectedMaxLosingStreak} Trades
              </p>
              <span className="text-[9px] text-[#4A5836] font-mono">Expected stat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
