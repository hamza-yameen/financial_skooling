"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, HelpCircle } from "lucide-react";
import BrandIcon from "@/components/BrandIcon";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for telemetry
    console.error("Application execution error:", error);
  }, [error]);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
      {/* Background ambient error blooms */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[400px] bg-rose-100/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[350px] bg-[#BAC8A1]/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-lg w-full text-center space-y-8 p-8 sm:p-12 rounded-3xl bg-white/95 border border-[#EBE2D6] backdrop-blur-xl shadow-xl shadow-[#5C6E42]/10">
        {/* Brand Icon & Alert Header */}
        <div className="flex flex-col items-center gap-3">
          <BrandIcon className="w-14 h-14 rounded-2xl shadow-md shadow-[#5C6E42]/20" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-mono font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            OPERATIONAL EXCEPTION DETECTED
          </div>
        </div>

        {/* Headline & Description */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1C2417]">
            Something Interrupted This Request
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5836] leading-relaxed font-medium">
            An unexpected error occurred during terminal execution. Your session identity and data
            remain fully intact and secured.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-[#7E8773] bg-[#F7F2EB] py-1 px-3 rounded-lg inline-block border border-[#EBE2D6]">
              Digest: {error.digest}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] text-white font-extrabold text-xs shadow-md shadow-[#5C6E42]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#F7F2EB] border border-[#EBE2D6] text-xs font-bold text-[#1C2417] shadow-xs hover:border-[#8B9B6D] transition-all"
          >
            <Home className="w-3.5 h-3.5 text-[#5C6E42]" />
            Return Home
          </Link>
        </div>

        {/* Support Link */}
        <div className="pt-4 border-t border-[#EBE2D6]">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7E8773] hover:text-[#5C6E42] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Persistent issue? Dispatch an incident report to Support
          </Link>
        </div>
      </div>
    </div>
  );
}

