"use client";

import React from "react";
import { Coins, ShieldCheck, CheckCircle2, Sparkles, Zap, Award } from "lucide-react";
import { useCurrencyCart } from "./CurrencyCartContext";

export interface CreditPackageSummaryData {
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
}

export default function CreditCheckoutSummary({
  pkg,
}: {
  pkg: CreditPackageSummaryData;
}) {
  const { currency, userCredits } = useCurrencyCart();

  const totalCredits = pkg.credits + pkg.bonusCredits;
  const displayPrice =
    currency === "GBP" && pkg.priceGbp ? `£${pkg.priceGbp}` : `€${pkg.price}`;

  return (
    <div className="sticky top-28 rounded-xl bg-white border border-[#D5DEE5] p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-[#1D2A36] uppercase tracking-wider font-mono">
          Package Summary
        </h2>
        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/40">
          CURRENCY: {currency}
        </span>
      </div>

      {/* Package Highlight Box */}
      <div className="p-5 rounded-xl bg-[#132030] text-white border border-[#314352] space-y-4 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            {pkg.badge && (
              <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#1D2A36] text-[#31F2BF] border border-[#31F2BF]/30 mb-1.5">
                {pkg.badge}
              </span>
            )}
            <h3 className="text-lg font-black tracking-tight text-white">
              {pkg.name}
            </h3>
            {pkg.tagline && (
              <p className="text-xs text-[#8995A1] mt-0.5 leading-snug">
                {pkg.tagline}
              </p>
            )}
          </div>

          <div className="w-10 h-10 rounded-lg bg-[#1D2A36] border border-[#31F2BF]/30 flex items-center justify-center text-[#31F2BF] shrink-0">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* Credits Breakdown Ribbon */}
        <div className="p-3.5 rounded-lg bg-[#0D1726] border border-[#314352] flex items-baseline justify-between font-mono">
          <div>
            <span className="text-[10px] uppercase text-[#8995A1] block font-sans">
              Delivered Credits
            </span>
            <span className="text-2xl font-black text-[#31F2BF]">
              {totalCredits}
            </span>
            <span className="text-xs font-bold text-white/80 ml-1">Credits</span>
          </div>

          <div className="text-right text-[11px] text-[#8995A1]">
            <span>{pkg.credits} Base</span>
            {pkg.bonusCredits > 0 && (
              <span className="text-[#31F2BF] font-bold block">
                + {pkg.bonusCredits} Bonus
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Calculations Breakdown */}
      <div className="space-y-3 text-xs border-t border-[#EDF1F5] pt-4 font-medium">
        <div className="flex justify-between text-[#657482]">
          <span>Package Base Price</span>
          <span className="font-mono text-[#1D2A36] font-bold">{displayPrice}</span>
        </div>
        <div className="flex justify-between text-[#657482]">
          <span>Value Added Tax (VAT)</span>
          <span className="font-mono text-[#1D2A36]">0.00 (Educational Exemption)</span>
        </div>
        <div className="flex justify-between text-[#657482]">
          <span>Credit Expiration Window</span>
          <span className="font-mono text-[#007554] font-bold">Never Expire</span>
        </div>
        <div className="flex justify-between text-[#657482]">
          <span>Wallet Balance Post-Purchase</span>
          <span className="font-mono text-[#007554] font-bold">
            {(userCredits || 0) + totalCredits} Credits
          </span>
        </div>

        <div className="pt-3 border-t border-[#EDF1F5] flex justify-between items-baseline">
          <span className="text-sm font-bold text-[#1D2A36]">Total One-Time</span>
          <div className="text-right">
            <span className="text-2xl font-black text-[#1D2A36] font-mono block">
              {displayPrice}
            </span>
            <span className="text-[10px] font-mono text-[#8995A1]">
              Zero recurring subscriptions
            </span>
          </div>
        </div>
      </div>

      {/* Key Deliverables Checklist */}
      {pkg.features && pkg.features.length > 0 && (
        <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] space-y-2 text-xs">
          <span className="font-bold text-[#1D2A36] flex items-center gap-1.5 font-mono">
            <Sparkles className="w-4 h-4 text-[#007554]" />
            What this bundle unlocks
          </span>
          <ul className="space-y-1.5 text-[#657482] text-[11px] font-medium">
            {pkg.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#007554] shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Institutional Guarantee Box */}
      <div className="p-4 rounded-xl bg-white border border-[#D5DEE5] space-y-1.5 text-xs">
        <span className="font-bold text-[#1D2A36] flex items-center gap-1.5 font-mono text-[11px]">
          <ShieldCheck className="w-4 h-4 text-[#007554]" />
          Instant Study Provisioning
        </span>
        <p className="text-[#657482] text-[11px] leading-relaxed">
          Credits are immediately added to your wallet upon checkout completion. You can
          spend them instantly to unlock full PDF manual playbooks and quantitative lab models.
        </p>
      </div>
    </div>
  );
}

