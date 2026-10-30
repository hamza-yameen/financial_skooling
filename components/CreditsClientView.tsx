"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Coins,
  Check,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useCurrencyCart } from "@/components/CurrencyCartContext";

export interface DynamicCreditPackage {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  credits: number;
  bonusCredits: number;
  price: number;
  priceGbp: number | null;
  currency: string;
  badge: string | null;
  popular: boolean;
  features: string[];
  order: number;
}

export default function CreditsClientView({
  packages,
}: {
  packages: DynamicCreditPackage[];
}) {
  const router = useRouter();
  const { currency, userCredits } = useCurrencyCart();
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    packages.find((p) => p.popular)?.id || packages[1]?.id || packages[0]?.id || ""
  );

  const selectedPkg =
    packages.find((p) => p.id === selectedPkgId) || packages[0];

  const selectedDisplayPrice = selectedPkg
    ? currency === "GBP" && selectedPkg.priceGbp
      ? `£${selectedPkg.priceGbp}`
      : `€${selectedPkg.price}`
    : "";

  const selectedTotalCredits = selectedPkg
    ? selectedPkg.credits + selectedPkg.bonusCredits
    : 0;

  const handleProceed = (pkgId: string) => {
    router.push(`/checkout/credits/${pkgId}`);
  };

  return (
    <div className="min-h-screen bg-[#EDF1F5] text-[#1D2A36] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ==================================================================== */}
        {/* HERO CONTAINER: EXACT REPLICA OF INCREASE CARD DESIGN (IMAGE 5)      */}
        {/* ==================================================================== */}
        <div className="bg-[#FAFBFD] rounded-2xl sm:rounded-3xl border border-[#D5DEE5] shadow-xl shadow-[#0C1927]/04 overflow-hidden">
          {/* Top Header Area */}
          <div className="p-6 sm:p-10 space-y-4 border-b border-[#E9EFF4] bg-white">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3FFF3] text-[#007554] text-xs font-mono font-bold uppercase tracking-wider border border-[#31F2BF]/40 shadow-xs">
                <Coins className="w-3.5 h-3.5 text-[#007554]" />
                FINSKOOL CREDITS WALLET
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F8FA] text-[#1D2A36] text-xs font-mono font-bold border border-[#D5DEE5] shadow-xs">
                Current:{" "}
                <strong className="text-[#007554] font-black">
                  {userCredits !== null ? `${userCredits} Credits` : "100 Credits"}
                </strong>
              </span>
            </div>

            <div className="space-y-1.5 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-[#1D2A36] leading-[1.1]">
                Unlock Any Course With Credits
              </h1>
              <p className="text-sm sm:text-base text-[#657482] font-medium leading-relaxed">
                Credits never expire. Purchase a package to unlock any course across the academy with massive bundle discounts.
              </p>
            </div>
          </div>

          {/* 4 Dynamic Packages Grid */}
          <div className="p-6 sm:p-8 pt-8 sm:pt-10 bg-[#FAFBFD]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
              {packages.map((pkg) => {
                const isSelected = selectedPkgId === pkg.id;
                const totalCredits = pkg.credits + pkg.bonusCredits;
                const displayPrice =
                  currency === "GBP" && pkg.priceGbp
                    ? `£${pkg.priceGbp}`
                    : `€${pkg.price}`;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`rounded-2xl p-6 sm:p-6.5 border flex flex-col justify-between relative transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-white border-[#1D2A36] shadow-lg shadow-[#0C1927]/08 ring-2 ring-[#1D2A36]"
                        : "bg-white hover:bg-white border-[#D5DEE5] hover:border-[#8995A1] shadow-xs"
                    }`}
                  >
                    {/* Centered Pill Badge on Top Edge */}
                    {pkg.badge && (
                      <span
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap shadow-xs ${
                          pkg.popular
                            ? "bg-[#132030] text-[#31F2BF] border border-[#31F2BF]/40"
                            : "bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/40"
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    )}

                    {/* Card Body */}
                    <div className="space-y-4 pt-1">
                      <div>
                        <h3 className="text-lg font-black text-[#1D2A36] tracking-tight">
                          {pkg.name}
                        </h3>
                        {pkg.tagline && (
                          <p className="text-xs text-[#657482] mt-1 leading-snug min-h-[34px]">
                            {pkg.tagline}
                          </p>
                        )}
                      </div>

                      {/* Credits Highlight Container */}
                      <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#E2E8F0] space-y-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-black text-[#1D2A36] font-mono">
                            {totalCredits}
                          </span>
                          <span className="text-xs font-bold text-[#007554] font-mono">
                            Credits
                          </span>
                        </div>
                        {pkg.bonusCredits > 0 ? (
                          <span className="text-[11px] font-mono font-bold text-[#007554] block">
                            Includes {pkg.bonusCredits} Bonus Credits
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-[#8995A1] block">
                            Standard Allocation
                          </span>
                        )}
                      </div>

                      {/* Feature Checklist */}
                      {pkg.features && pkg.features.length > 0 && (
                        <ul className="space-y-2.5 text-xs text-[#52606D] font-medium pt-1">
                          {pkg.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-[#007554] shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Card Bottom Row: One-Time Price + Select Button */}
                    <div className="pt-5 border-t border-[#EDF1F5] mt-6 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-semibold text-[#8995A1] block">
                          ONE-TIME
                        </span>
                        <span className="text-2xl font-black text-[#1D2A36] font-mono">
                          {displayPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPkgId(pkg.id);
                          handleProceed(pkg.id);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
                          isSelected
                            ? "bg-[#1D2A36] hover:bg-[#132030] text-white shadow-xs border border-[#132030]"
                            : "bg-white hover:bg-[#F5F8FA] text-[#1D2A36] border border-[#D5DEE5]"
                        }`}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Bar (Image 5 Footer) */}
          <div className="p-5 sm:p-6 bg-white border-t border-[#D5DEE5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#657482] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#007554] shrink-0" />
              <span>
                100% Mock Testing Environment • Instant balance update • Non-expiring credits
              </span>
            </div>

            {selectedPkg && (
              <button
                type="button"
                onClick={() => handleProceed(selectedPkg.id)}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#132030] hover:bg-[#0C1927] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#31F2BF]/30"
              >
                <span>
                  Get {selectedTotalCredits} Credits for {selectedDisplayPrice}
                </span>
                <ArrowRight className="w-4 h-4 text-[#31F2BF]" />
              </button>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* COURSE EXCHANGE DIRECTORY & FAQ SECTION                             */}
        {/* ==================================================================== */}
        <div className="p-8 rounded-2xl bg-white border border-[#D5DEE5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#1D2A36] tracking-tight">
                Curriculum Credit Pricing
              </h2>
              <p className="text-xs text-[#657482] mt-0.5">
                Every course can be unlocked instantly with credits instead of direct card checkout.
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007554] hover:underline"
            >
              <span>Explore All Courses</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#8995A1]">Course #1</span>
              <h4 className="text-xs font-bold text-[#1D2A36] line-clamp-2">
                Modern Wealth & Credit Architecture
              </h4>
              <div className="pt-1 flex items-baseline justify-between font-mono">
                <span className="text-xs text-[#8995A1] line-through">€249</span>
                <span className="text-sm font-black text-[#007554]">25 Credits</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#8995A1]">Course #2</span>
              <h4 className="text-xs font-bold text-[#1D2A36] line-clamp-2">
                Systematic Markets & Quant Strategy Lab
              </h4>
              <div className="pt-1 flex items-baseline justify-between font-mono">
                <span className="text-xs text-[#8995A1] line-through">€699</span>
                <span className="text-sm font-black text-[#007554]">70 Credits</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#8995A1]">Course #3</span>
              <h4 className="text-xs font-bold text-[#1D2A36] line-clamp-2">
                Real Estate Deal Analysis & Underwriting
              </h4>
              <div className="pt-1 flex items-baseline justify-between font-mono">
                <span className="text-xs text-[#8995A1] line-through">€499</span>
                <span className="text-sm font-black text-[#007554]">50 Credits</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#8995A1]">Course #4</span>
              <h4 className="text-xs font-bold text-[#1D2A36] line-clamp-2">
                AI-Powered Digital Business Systems
              </h4>
              <div className="pt-1 flex items-baseline justify-between font-mono">
                <span className="text-xs text-[#8995A1] line-through">€399</span>
                <span className="text-sm font-black text-[#007554]">40 Credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#D5DEE5] shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl font-black text-[#1D2A36]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#657482]">
              Everything you need to know about purchasing and spending credits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
            <div className="p-5 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] space-y-2">
              <h4 className="font-bold text-[#1D2A36]">Do Financial Skool credits expire?</h4>
              <p className="text-[#657482] leading-relaxed">
                No. Credits have no expiration date. You can purchase a package today and spend
                them months or years later as new curricula and spreadsheet models drop.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] space-y-2">
              <h4 className="font-bold text-[#1D2A36]">Can I combine credits with cash checkout?</h4>
              <p className="text-[#657482] leading-relaxed">
                If your credit balance covers the full credit requirement of a course, enrollment is
                instantaneous with zero cash required. If you need more credits, you can top up your
                wallet with a package in seconds.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] space-y-2">
              <h4 className="font-bold text-[#1D2A36]">Do credit enrollments include lifetime updates?</h4>
              <p className="text-[#657482] leading-relaxed">
                Yes. Any course unlocked using credits receives the exact same lifetime access,
                downloadable PDF field manuals, and interactive risk engines as cash purchases.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] space-y-2">
              <h4 className="font-bold text-[#1D2A36]">How do I check my remaining balance?</h4>
              <p className="text-[#657482] leading-relaxed">
                Your live credit balance is visible directly in the top navigation bar, in the
                slide-out menu drawer, and inside your Student Terminal dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
