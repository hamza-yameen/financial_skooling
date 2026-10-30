"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import HeroBackgroundCanvas from "./HeroBackgroundCanvas";
import {
  ArrowRight,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  Star,
  Check,
} from "lucide-react";

const ROTATING_PHRASES = [
  "Through institutional playbooks.",
  "With algorithmic precision.",
  "With verified pro formas.",
  "Without recycled signals.",
];

export default function LandingHero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
        setIsAnimating(false);
      }, 350);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full bg-[#EDF1F5] border-b border-[#D5DEE5] overflow-hidden">
      {/* ========================================================= */}
      {/* ANIMATED ORGANIC FLUID SMOKE ACROSS THE WHOLE HERO SECTION */}
      {/* High-DPI Canvas: Continuous mathematical radial falloff     */}
      {/* 100% seam-free, zero GPU tile clipping, organic fluid flow */}
      {/* ========================================================= */}
      <HeroBackgroundCanvas />

      {/* Soft Noise Texture Overlay for authentic velvet smoke texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1D2A36 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* ========================================================= */}
      {/* 1. EMBEDDED HEADER INSIDE HERO (100% Edge-to-Edge)        */}
      {/* ========================================================= */}
      <div className="relative z-30">
        <Navbar embedded={true} />
      </div>

      {/* ========================================================= */}
      {/* 2. FLOATING SOCIAL PROOF CARD (Right side - Increase Style) */}
      {/* ========================================================= */}
      <div className="hidden xl:flex absolute right-8 sm:right-14 top-[56%] -translate-y-1/2 flex-col items-center p-4 rounded-xl bg-white border border-[#D5DEE5] shadow-lg shadow-[#0C1927]/06 w-44 space-y-2 pointer-events-auto transition-transform hover:scale-105 duration-300 z-20">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#657482] font-bold">
          Financial Skool
        </span>

        <div className="w-full py-1 px-2 rounded-md bg-[#132030] text-[#31F2BF] text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs border border-[#31F2BF]/20">
          <Check className="w-3 h-3 text-[#31F2BF]" />
          <span>VERIFIED CURRICULUM</span>
        </div>

        <div className="flex items-center gap-1 text-amber-500 py-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs font-black text-[#1D2A36] tracking-tight">EXCELLENT</p>
          <p className="text-[10px] text-[#007554] font-bold">100% Practical Manuals</p>
        </div>

        <div className="pt-2 border-t border-[#EDF1F5] w-full text-center">
          <span className="text-[9px] font-mono text-[#8995A1]">
            1,840+ Operators • Audited
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. HERO BODY: BADGE, HEADLINE, SUBTITLE & CTAS             */}
      {/* ========================================================= */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 sm:pb-28 text-center space-y-7 sm:space-y-8">
        {/* Top Dark Compliance/Feature Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-[#132030] text-white text-xs sm:text-[13px] font-medium border border-[#314352] shadow-lg shadow-[#0C1927]/10 backdrop-blur-md">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#31F2BF] text-[#053226]">
            <ShieldCheck className="w-2.5 h-2.5" />
          </span>
          <span className="tracking-tight text-white/95">
            CPD Certified & Institutional Grade • Quantitative Framework 2026
          </span>
        </div>

        {/* Main Headline with Dynamic Rotating Second Line */}
        <div className="space-y-1 sm:space-y-2">
          {/* Line 1: Static */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight text-[#1D2A36] leading-[1.08] sm:leading-[1.05]">
            Build wealth faster.
          </h1>

          {/* Line 2: Dynamically Rotating with Smooth Slide/Fade */}
          <div className="min-h-[1.15em] flex items-center justify-center overflow-hidden">
            <p
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight text-[#1D2A36] leading-[1.08] sm:leading-[1.05] transition-all duration-300 ease-out transform ${
                isAnimating
                  ? "opacity-0 -translate-y-4 scale-95"
                  : "opacity-100 translate-y-0 scale-100"
              }`}
            >
              {ROTATING_PHRASES[phraseIndex]}
            </p>
          </div>

          {/* Line 3: Static with Increase Signature Cyan/Emerald Gradient */}
          <p className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight leading-[1.08] sm:leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-[#1D2A36] via-[#007554] to-[#31F2BF]">
            All in one platform.
          </p>
        </div>

        {/* Subtitle Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-[#657482] leading-relaxed max-w-2xl mx-auto font-medium">
          Exhaustive manual-first playbooks, practical real estate pro formas, and algorithmic
          drawdown mathematics. Everything you need to architect generational wealth without
          recycled signals or recurring traps.
        </p>

        {/* Action Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2">
          <Link
            href="/courses"
            className="w-full sm:w-auto px-8 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-[#1D2A36] hover:bg-[#132030] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#1D2A36]/15 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 group cursor-pointer border border-[#132030]"
          >
            <span>Explore Programs & Labs</span>
            <ArrowRight className="w-4 h-4 text-[#31F2BF] group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/simulator"
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-[#F5F8FA] border border-[#D5DEE5] text-[#1D2A36] font-bold text-sm sm:text-base shadow-xs hover:border-[#8995A1] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-[#007554]" />
            <span>Launch Risk Simulator</span>
          </Link>
        </div>

        {/* Trust Guarantees */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#657482] font-semibold font-mono">
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#D5DEE5] shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#007554]" />
            One-Time Lifetime Access
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#D5DEE5] shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#007554]" />
            PDF-First Field Manuals
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#D5DEE5] shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#007554]" />
            Zero Recurring Traps
          </span>
        </div>
      </div>
    </div>
  );
}
