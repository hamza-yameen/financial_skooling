"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Check,
  Coins,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useCurrencyCart } from "./CurrencyCartContext";
import { CREDIT_PACKAGES, CreditPackage } from "@/lib/credits";

export default function BuyCreditsModal() {
  const router = useRouter();
  const {
    isCreditsModalOpen,
    setIsCreditsModalOpen,
    userCredits,
    currency,
  } = useCurrencyCart();

  const [packages, setPackages] = useState<CreditPackage[]>(CREDIT_PACKAGES);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage>(
    CREDIT_PACKAGES[1] // Default to Popular "Quantitative Pro"
  );

  useEffect(() => {
    if (isCreditsModalOpen) {
      fetch("/api/credits/packages")
        .then((res) => res.json())
        .then((data) => {
          if (data.packages && data.packages.length > 0) {
            const mapped: CreditPackage[] = data.packages.map((p: any) => ({
              id: p.id,
              name: p.name,
              credits: p.credits,
              bonusCredits: p.bonusCredits,
              totalCredits: p.credits + p.bonusCredits,
              price: p.price,
              priceGbp: p.priceGbp || Math.round(p.price * 0.85),
              badge: p.badge,
              popular: p.popular,
              tagline: p.tagline || "",
              description: p.description || "",
              features: p.features || [],
            }));
            setPackages(mapped);
            const popular = mapped.find((p) => p.popular) || mapped[1] || mapped[0];
            setSelectedPackage(popular);
          }
        })
        .catch(() => {});
    }
  }, [isCreditsModalOpen]);

  if (!isCreditsModalOpen) return null;

  const handleProceedToCheckout = (pkg: CreditPackage) => {
    setIsCreditsModalOpen(false);
    router.push(`/checkout/credits/${pkg.id}`);
  };

  const selectedDisplayPrice =
    currency === "GBP" && selectedPackage.priceGbp
      ? `£${selectedPackage.priceGbp}`
      : `€${selectedPackage.price}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white border border-[#D5DEE5] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3FFF3] text-[#007554] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#31F2BF]/40">
                  <Coins className="w-3.5 h-3.5" />
                  FINSKOOL CREDITS WALLET
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EDF1F5] text-[#1D2A36] text-[10px] font-mono font-bold border border-[#D5DEE5]">
                  Current:{" "}
                  <strong className="text-[#007554] font-black">
                    {userCredits !== null ? `${userCredits} Credits` : "100 Credits"}
                  </strong>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#1D2A36] tracking-tight pt-2">
                Unlock Any Course With Credits
              </h2>
              <p className="text-xs sm:text-sm text-[#657482] max-w-2xl leading-relaxed">
                Credits never expire. Purchase a package to unlock any course across the academy with massive bundle discounts.
              </p>
            </div>

            <button
              onClick={() => setIsCreditsModalOpen(false)}
              className="p-2 rounded-lg text-[#8995A1] hover:text-[#1D2A36] hover:bg-[#F5F8FA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4 Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
            {packages.map((pkg) => {
              const isSelected = selectedPackage.id === pkg.id;
              const displayPrice =
                currency === "GBP" && pkg.priceGbp
                  ? `£${pkg.priceGbp}`
                  : `€${pkg.price}`;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`rounded-xl p-5 border flex flex-col justify-between relative transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white border-[#1D2A36] shadow-md ring-2 ring-[#1D2A36]"
                      : "bg-white hover:bg-white border-[#D5DEE5] hover:border-[#8995A1] shadow-xs"
                  }`}
                >
                  {pkg.badge && (
                    <span
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider whitespace-nowrap shadow-xs ${
                        pkg.popular
                          ? "bg-[#132030] text-[#31F2BF] border border-[#31F2BF]/30"
                          : "bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/40"
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  )}

                  <div className="space-y-3.5">
                    <div>
                      <h3 className="text-base font-black text-[#1D2A36] tracking-tight">
                        {pkg.name}
                      </h3>
                      {pkg.tagline && (
                        <p className="text-[11px] text-[#657482] mt-0.5 leading-snug line-clamp-2">
                          {pkg.tagline}
                        </p>
                      )}
                    </div>

                    {/* Credits Counter Pill */}
                    <div className="p-3.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] space-y-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-[#1D2A36] font-mono">
                          {pkg.totalCredits}
                        </span>
                        <span className="text-xs font-bold text-[#007554] font-mono">
                          Credits
                        </span>
                      </div>
                      {pkg.bonusCredits > 0 ? (
                        <span className="text-[10px] font-mono font-bold text-[#007554] block">
                          Includes {pkg.bonusCredits} Bonus Credits
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#8995A1] block">
                          Standard Allocation
                        </span>
                      )}
                    </div>

                    {/* Features list */}
                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="space-y-1.5 text-[11px] text-[#657482] font-medium pt-1">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#007554] shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Price & Select Button */}
                  <div className="pt-4 border-t border-[#EDF1F5] mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8995A1] block">
                        ONE-TIME
                      </span>
                      <span className="text-lg font-black text-[#1D2A36] font-mono">
                        {displayPrice}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackage(pkg);
                        handleProceedToCheckout(pkg);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer font-mono ${
                        isSelected
                          ? "bg-[#1D2A36] text-white shadow-xs border border-[#132030]"
                          : "bg-white border border-[#D5DEE5] text-[#1D2A36] hover:bg-[#F5F8FA]"
                      }`}
                    >
                      <span>Select</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4 border-t border-[#D5DEE5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#657482]">
              <ShieldCheck className="w-4 h-4 text-[#007554] shrink-0" />
              <span>
                100% Mock Testing Environment • Instant balance update • Non-expiring credits
              </span>
            </div>

            <button
              onClick={() => handleProceedToCheckout(selectedPackage)}
              className="px-6 py-3 rounded-xl bg-[#132030] hover:bg-[#0C1927] text-white font-extrabold text-xs sm:text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#31F2BF]/30"
            >
              <span>
                Get {selectedPackage.totalCredits} Credits for {selectedDisplayPrice}
              </span>
              <ArrowRight className="w-4 h-4 text-[#31F2BF]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
