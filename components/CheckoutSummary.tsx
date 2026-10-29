"use client";

import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { useCurrencyCart } from "./CurrencyCartContext";

interface CheckoutSummaryProps {
  course: {
    title: string;
    price: number;
    duration: string;
    coverImage: string | null;
    lessons: { slug: string }[];
  };
}

export default function CheckoutSummary({ course }: CheckoutSummaryProps) {
  const { formatPrice, currency } = useCurrencyCart();

  return (
    <div className="sticky top-28 rounded-3xl bg-white border border-[#EBE2D6] p-7 shadow-xl shadow-[#8B9B6D]/10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-[#1C2417] uppercase tracking-wider">
          Order Breakdown
        </h2>
        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#8B9B6D]/15 text-[#4A5836] border border-[#8B9B6D]/30">
          CURRENCY: {currency}
        </span>
      </div>

      {/* Program Card */}
      <div className="flex gap-4 p-4 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6]">
        <img
          src={
            course.coverImage ||
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80"
          }
          alt={course.title}
          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#EBE2D6]"
        />
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#5C6E42] uppercase font-bold">
            {course.duration}
          </span>
          <h3 className="text-xs font-bold text-[#1C2417] line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs font-mono text-[#7E8773]">
            {course.lessons.length} Modules & Playbooks
          </p>
        </div>
      </div>

      {/* Calculations Table */}
      <div className="space-y-3 text-xs border-t border-[#EBE2D6] pt-4 font-medium">
        <div className="flex justify-between text-[#636B58]">
          <span>Program License</span>
          <span className="font-mono text-[#1C2417] font-bold">{formatPrice(course.price)}</span>
        </div>
        <div className="flex justify-between text-[#636B58]">
          <span>Value Added Tax (VAT)</span>
          <span className="font-mono text-[#1C2417]">{formatPrice(0)} (Exempt)</span>
        </div>
        <div className="flex justify-between text-[#636B58]">
          <span>Simulator Sandbox Access</span>
          <span className="font-mono text-[#5C6E42] font-bold">Included Free</span>
        </div>
        <div className="flex justify-between text-[#636B58]">
          <span>Future Curriculum Updates</span>
          <span className="font-mono text-[#5C6E42] font-bold">Perpetual</span>
        </div>

        <div className="pt-3 border-t border-[#EBE2D6] flex justify-between items-baseline">
          <span className="text-sm font-bold text-[#1C2417]">Total Amount</span>
          <span className="text-2xl font-black text-[#5C6E42] font-mono">
            {formatPrice(course.price)}
          </span>
        </div>
      </div>

      {/* Features Guarantee Box */}
      <div className="p-4 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6] space-y-2 text-xs">
        <span className="font-bold text-[#1C2417] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#5C6E42]" />
          Guaranteed Operational Coverage
        </span>
        <ul className="space-y-1.5 text-[#636B58] text-[11px] font-medium">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5C6E42] shrink-0" />
            Instant download capability for PDF manuals
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5C6E42] shrink-0" />
            Complete financial modeling spreadsheet files
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5C6E42] shrink-0" />
            No recurring charges, hidden fees, or rebills
          </li>
        </ul>
      </div>
    </div>
  );
}
