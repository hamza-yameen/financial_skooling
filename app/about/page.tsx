import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Lock,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

export const metadata = {
  title: "Methodology & Architecture — Financial Skool",
  description:
    "Learn about the philosophy of Financial Skool: Education without hype, PDF-first field manuals, and institutional underwriting mechanics.",
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background ambient blooms */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[450px] bg-[#8B9B6D]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-[#BAC8A1]/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B9B6D]/10 border border-[#8B9B6D]/30 text-xs font-mono font-bold text-[#384524] uppercase tracking-widest shadow-xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#5C6E42]" />
            DOCTRINE & OPERATING PHILOSOPHY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1C2417] leading-tight">
            Financial Education Engineered for <span className="text-gradient-primary">Modern Wealth Builders.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#4A5836] leading-relaxed font-medium">
            Financial Skool was established to cut through the internet&apos;s endless marketing noise.
            We teach the mechanics of personal cash flows, institutional credit architecture, real estate
            equity underwriting, and systematic market algorithms.
          </p>
        </div>

        {/* The PDF-First Doctrine */}
        <div id="doctrine" className="scroll-mt-24 rounded-3xl bg-white border border-[#EBE2D6] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-[#5C6E42] font-mono text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            WHY WE REFUSE 20-HOUR VIDEO PLAYLISTS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1C2417] tracking-tight">
            The PDF-First Manual Doctrine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#4A5836] leading-relaxed font-medium">
            <p>
              In modern corporate finance, private equity, and quant prop trading desks, strategies are
              never communicated through meandering video webinars. They are codified in tight, dense,
              rigorously formatted <strong className="text-[#1C2417]">operating field manuals</strong>.
            </p>
            <p>
              Every Financial Skool module is delivered as a 14 to 20-page high-density architectural
              PDF playbook accompanied by production spreadsheet files. You can read, highlight, print,
              and keep it open side-by-side on your trading terminal or deal underwriting screen.
            </p>
          </div>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#EBE2D6]/70">
            <div className="p-5 rounded-2xl bg-[#8B9B6D]/10 border border-[#8B9B6D]/30">
              <span className="text-[#384524] font-mono font-black text-xl">100% Dense</span>
              <p className="text-xs text-[#4A5836] mt-1 font-medium">Zero talking-head filler or YouTube banter.</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
              <span className="text-emerald-700 font-mono font-black text-xl">Searchable Code</span>
              <p className="text-xs text-[#4A5836] mt-1 font-medium">Instant formula lookups during live executions.</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#EBE2D6]/50 border border-[#EBE2D6]">
              <span className="text-[#2E3C1B] font-mono font-black text-xl">Permanent Ownership</span>
              <p className="text-xs text-[#4A5836] mt-1 font-medium">Downloadable to your local encrypted storage.</p>
            </div>
          </div>
        </div>

        {/* Institutional Boundaries */}
        <div id="institutional" className="scroll-mt-24 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-black text-[#1C2417]">Institutional Boundaries & Integrity</h2>
            <p className="text-sm text-[#4A5836] font-medium">
              We hold strict standards to keep our educational mission honest, transparent, and compliant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl border border-[#EBE2D6] shadow-sm space-y-3 hover:shadow-xl hover:shadow-[#8B9B6D]/15 hover:border-[#8B9B6D] hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C2417]">No Subscription Traps</h3>
              <p className="text-xs text-[#4A5836] leading-relaxed font-medium">
                We never charge recurring monthly fees. When you acquire a Financial Skool license, you
                own that program perpetually.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-[#EBE2D6] shadow-sm space-y-3 hover:shadow-xl hover:shadow-[#8B9B6D]/15 hover:border-[#8B9B6D] hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[#8B9B6D]/10 border border-[#8B9B6D]/30 flex items-center justify-center text-[#5C6E42]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C2417]">No Trade Signals</h3>
              <p className="text-xs text-[#4A5836] leading-relaxed font-medium">
                Signal channels create psychological dependency and financial ruin. We teach mathematical
                models so you execute independently.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-[#EBE2D6] shadow-sm space-y-3 hover:shadow-xl hover:shadow-[#8B9B6D]/15 hover:border-[#8B9B6D] hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C2417]">Pure Mechanical Truth</h3>
              <p className="text-xs text-[#4A5836] leading-relaxed font-medium">
                Every concept is tested against mathematical expected value, verifiable accounting rules,
                and historical drawdowns.
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Publisher Disclosure */}
        <div className="p-8 rounded-3xl bg-white border border-[#EBE2D6] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B9B6D]/15 text-[#384524] text-[11px] font-bold tracking-wider uppercase border border-[#8B9B6D]/30">
                <span className="w-2 h-2 rounded-full bg-[#5C6E42] animate-pulse" />
                REGISTERED PUBLISHER
              </span>
              <h3 className="text-xl font-black text-[#1C2417] tracking-tight">
                OMEGA IMPORT LTD
              </h3>
            </div>
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#F7F2EB] text-[#1C2417] text-xs font-mono font-bold border border-[#EBE2D6]">
              Company Reg: <strong className="text-[#1C2417] ml-1.5">208928597</strong>
            </span>
          </div>

          <div className="flex items-start sm:items-center gap-2.5 text-xs text-[#4A5836] font-medium">
            <MapPin className="w-4 h-4 text-[#5C6E42] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Bulgaria, Varna Province, Aksakovo Municipality, town of Ignatievo, Postal Code 9143, 23 Sinchets Street
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="tel:+359898629156"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F7F2EB] hover:bg-[#EBE2D6] border border-[#EBE2D6] text-xs font-semibold text-[#1C2417] shadow-xs hover:text-[#5C6E42] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#8B9B6D]" />
              <span>+359898629156</span>
            </a>
            <a
              href="mailto:support@financialskool.com"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F7F2EB] hover:bg-[#EBE2D6] border border-[#EBE2D6] text-xs font-semibold text-[#1C2417] shadow-xs hover:text-[#5C6E42] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#8B9B6D]" />
              <span>support@financialskool.com</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F7F2EB] hover:bg-[#EBE2D6] border border-[#EBE2D6] text-xs font-semibold text-[#1C2417] shadow-xs hover:text-[#5C6E42] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#8B9B6D]" />
              <span>financialskool.com</span>
            </Link>
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#8B9B6D]/15 border border-[#8B9B6D]/30 text-xs font-bold text-[#384524]">
              <Lock className="w-3.5 h-3.5 text-[#5C6E42]" />
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] text-white font-extrabold text-sm shadow-xl shadow-[#5C6E42]/25 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
          >
            View The Full Curriculum
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
