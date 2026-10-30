"use client";

import React from "react";
import Link from "next/link";
import {
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useCurrencyCart } from "@/components/CurrencyCartContext";
import { CREDIT_PACKAGES } from "@/lib/credits";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  metadata: string | null;
  createdAt: Date;
}

export default function StudentCreditsClient({
  initialCredits,
  transactions,
}: {
  initialCredits: number;
  transactions: Transaction[];
}) {
  const { userCredits, setIsCreditsModalOpen, currency } = useCurrencyCart();
  const currentCredits = userCredits ?? initialCredits;

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D5DEE5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#007554] bg-[#E3FFF3] px-2.5 py-0.5 rounded-full border border-[#31F2BF]/40">
              LEDGER & ASSETS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1D2A36] tracking-tight">
            Credits & Student Wallet
          </h1>
          <p className="text-xs sm:text-sm text-[#657482] mt-1">
            Spend non-expiring credits on any curriculum playbook or quant strategy engine.
          </p>
        </div>

        <Link
          href="/credits"
          className="px-5 py-2.5 rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-white font-extrabold text-xs shadow-xs hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#132030] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#31F2BF]" />
          <span>Top Up Credits</span>
        </Link>
      </div>

      {/* Wallet Balance Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-7 rounded-xl bg-white border border-[#D5DEE5] shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8995A1] font-semibold block">
                Available Study Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-[#1D2A36] font-mono">
                  {currentCredits}
                </span>
                <span className="text-lg font-bold text-[#007554]">Credits</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-xl bg-[#E3FFF3] border border-[#31F2BF]/30 flex items-center justify-center text-[#007554]">
              <Coins className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#EDF1F5] text-xs">
            <div>
              <span className="text-[10px] text-[#8995A1] block uppercase font-mono">
                Buying Power
              </span>
              <span className="font-bold text-[#1D2A36]">
                ~{Math.floor(currentCredits / 25)} Full Courses
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8995A1] block uppercase font-mono">
                Expiration
              </span>
              <span className="font-bold text-[#007554]">Never Expire</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#8995A1] block uppercase font-mono">
                Status
              </span>
              <span className="font-bold text-[#1D2A36] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#31F2BF]" />
                Institutional Verified
              </span>
            </div>
          </div>
        </div>

        {/* Quick Top-Up Recommendation */}
        <div className="p-7 rounded-xl bg-[#132030] text-white shadow-lg flex flex-col justify-between space-y-4 border border-[#314352]">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1D2A36] text-[#31F2BF] border border-[#31F2BF]/30 inline-block">
              RECOMMENDED PACK
            </span>
            <h3 className="text-lg font-black tracking-tight text-white">Quantitative Pro</h3>
            <p className="text-xs text-[#8995A1] leading-relaxed">
              Add 145 Credits (+25 Bonus) for €99. Instant access to multiple quantitative playbooks.
            </p>
          </div>

          <Link
            href="/credits"
            className="w-full py-3 rounded-lg bg-white hover:bg-[#F5F8FA] text-[#1D2A36] font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-transparent"
          >
            <span>View All Packages</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#007554]" />
          </Link>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="p-7 rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#1D2A36] tracking-tight">
              Credit Transaction History
            </h3>
            <p className="text-xs text-[#8995A1] mt-0.5">
              Audited record of purchases, course enrollments, and grants.
            </p>
          </div>

          <Link
            href="/courses"
            className="text-xs font-bold text-[#007554] hover:underline flex items-center gap-1"
          >
            <span>Browse Courses to Spend</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F5F8FA] border border-[#D5DEE5] flex items-center justify-center mx-auto text-[#8995A1]">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#1D2A36]">No transactions recorded yet</p>
            <p className="text-xs text-[#657482] max-w-sm mx-auto">
              Your account begins with initial credits. When you enroll in courses or acquire top-up
              packages, entries will appear here.
            </p>
            <Link
              href="/credits"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer border border-[#132030]"
            >
              Get Credits Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDF1F5] text-[10px] uppercase font-mono text-[#8995A1]">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold text-right">Credits</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1F5]">
                {transactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  const dateStr = new Date(tx.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr key={tx.id} className="hover:bg-[#F5F8FA]/80 transition-colors">
                      <td className="py-3.5 font-mono text-[#8995A1]">{dateStr}</td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                            isPositive
                              ? "bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/30"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {isPositive ? (
                            <ArrowDownLeft className="w-3 h-3 text-[#007554]" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-[#1D2A36] max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td
                        className={`py-3.5 text-right font-mono font-black text-sm ${
                          isPositive ? "text-[#007554]" : "text-[#1D2A36]"
                        }`}
                      >
                        {isPositive ? `+${tx.amount}` : tx.amount} Cr
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#007554]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Settled
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

