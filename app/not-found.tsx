import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Home, HelpCircle, Compass } from "lucide-react";
import BrandIcon from "@/components/BrandIcon";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
      {/* Background ambient blooms */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[400px] bg-[#8B9B6D]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[350px] bg-[#BAC8A1]/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-lg w-full text-center space-y-8 p-8 sm:p-12 rounded-3xl bg-white/90 border border-[#EBE2D6] backdrop-blur-xl shadow-xl shadow-[#5C6E42]/10">
        {/* Brand Icon & 404 Badge */}
        <div className="flex flex-col items-center gap-3">
          <BrandIcon className="w-14 h-14 rounded-2xl shadow-md shadow-[#5C6E42]/20" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B9B6D]/15 text-[#4A5836] text-[11px] font-mono font-bold uppercase tracking-wider border border-[#8B9B6D]/30">
            <Compass className="w-3.5 h-3.5 text-[#5C6E42]" />
            ERROR 404 • ROUTE UNRESOLVED
          </div>
        </div>

        {/* Headline & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1C2417]">
            Page Not <span className="text-gradient-primary">Found</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5836] leading-relaxed font-medium">
            The quantitative manual, course material, or terminal route you are attempting to access
            does not exist or has been relocated within the academy.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] text-white font-extrabold text-xs shadow-md shadow-[#5C6E42]/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <Link
            href="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#F7F2EB] border border-[#EBE2D6] text-xs font-bold text-[#1C2417] shadow-xs hover:border-[#8B9B6D] transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#5C6E42]" />
            Explore Programs
          </Link>
        </div>

        {/* Support Link */}
        <div className="pt-4 border-t border-[#EBE2D6]">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7E8773] hover:text-[#5C6E42] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Need assistance? Contact Operational Support Desk
          </Link>
        </div>
      </div>
    </div>
  );
}

