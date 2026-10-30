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
    <div className="relative overflow-hidden min-h-screen bg-[#EDF1F5]">
      {/* Background ambient blooms */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[450px] bg-[#31F2BF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-[#34BCFF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E3FFF3] border border-[#31F2BF]/40 text-xs font-mono font-bold text-[#007554] uppercase tracking-widest shadow-xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#007554]" />
            DOCTRINE & OPERATING PHILOSOPHY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1D2A36] leading-tight">
            Financial Education Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D2A36] via-[#007554] to-[#31F2BF]">Modern Wealth Builders.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#657482] leading-relaxed font-medium">
            Financial Skool was established to cut through the internet&apos;s endless marketing noise.
            We teach the mechanics of personal cash flows, institutional credit architecture, real estate
            equity underwriting, and systematic market algorithms.
          </p>
        </div>

        {/* The PDF-First Doctrine */}
        <div id="doctrine" className="scroll-mt-24 rounded-xl bg-white border border-[#D5DEE5] p-8 sm:p-12 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-[#007554] font-mono text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            WHY WE REFUSE 20-HOUR VIDEO PLAYLISTS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1D2A36] tracking-tight">
            The PDF-First Manual Doctrine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#657482] leading-relaxed font-medium">
            <p>
              In modern corporate finance, private equity, and quant prop trading desks, strategies are
              never communicated through meandering video webinars. They are codified in tight, dense,
              rigorously formatted <strong className="text-[#1D2A36]">operating field manuals</strong>.
            </p>
            <p>
              Every Financial Skool module is delivered as a 14 to 20-page high-density architectural
              PDF playbook accompanied by production spreadsheet files. You can read, highlight, print,
              and keep it open side-by-side on your trading terminal or deal underwriting screen.
            </p>
          </div>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#EDF1F5]">
            <div className="p-5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5]">
              <span className="text-[#1D2A36] font-mono font-black text-xl">100% Dense</span>
              <p className="text-xs text-[#657482] mt-1 font-medium">Zero talking-head filler or YouTube banter.</p>
            </div>
            <div className="p-5 rounded-lg bg-[#E3FFF3] border border-[#31F2BF]/30">
              <span className="text-[#007554] font-mono font-black text-xl">Searchable Code</span>
              <p className="text-xs text-[#007554]/90 mt-1 font-medium">Instant formula lookups during live executions.</p>
            </div>
            <div className="p-5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5]">
              <span className="text-[#1D2A36] font-mono font-black text-xl">Permanent Ownership</span>
              <p className="text-xs text-[#657482] mt-1 font-medium">Downloadable to your local encrypted storage.</p>
            </div>
          </div>
        </div>

        {/* Institutional Boundaries */}
        <div id="institutional" className="scroll-mt-24 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-black text-[#1D2A36]">Institutional Boundaries & Integrity</h2>
            <p className="text-sm text-[#657482] font-medium">
              We hold strict standards to keep our educational mission honest, transparent, and compliant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-xl border border-[#D5DEE5] shadow-xs space-y-3 hover:border-[#8995A1] transition-all">
              <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1D2A36]">No Subscription Traps</h3>
              <p className="text-xs text-[#657482] leading-relaxed font-medium">
                We never charge recurring monthly fees. When you acquire a Financial Skool license, you
                own that program perpetually.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-[#D5DEE5] shadow-xs space-y-3 hover:border-[#8995A1] transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#E3FFF3] border border-[#31F2BF]/30 flex items-center justify-center text-[#007554]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1D2A36]">No Trade Signals</h3>
              <p className="text-xs text-[#657482] leading-relaxed font-medium">
                Signal channels create psychological dependency and financial ruin. We teach mathematical
                models so you execute independently.
              </p>
            </div>

            <div className="bg-white p-7 rounded-xl border border-[#D5DEE5] shadow-xs space-y-3 hover:border-[#8995A1] transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#132030] border border-[#314352] flex items-center justify-center text-[#31F2BF]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1D2A36]">Pure Mechanical Truth</h3>
              <p className="text-xs text-[#657482] leading-relaxed font-medium">
                Every concept is tested against mathematical expected value, verifiable accounting rules,
                and historical drawdowns.
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Publisher Disclosure */}
        <div className="p-8 rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3FFF3] text-[#007554] text-[11px] font-mono font-bold tracking-wider uppercase border border-[#31F2BF]/40">
                <span className="w-2 h-2 rounded-full bg-[#31F2BF] animate-pulse" />
                REGISTERED PUBLISHER
              </span>
              <h3 className="text-xl font-black text-[#1D2A36] tracking-tight">
                OMEGA IMPORT LTD
              </h3>
            </div>
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#F5F8FA] text-[#1D2A36] text-xs font-mono font-bold border border-[#D5DEE5]">
              Company Reg: <strong className="text-[#1D2A36] ml-1.5">208928597</strong>
            </span>
          </div>

          <div className="flex items-start sm:items-center gap-2.5 text-xs text-[#657482] font-medium">
            <MapPin className="w-4 h-4 text-[#007554] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Bulgaria, Varna Province, Aksakovo Municipality, town of Ignatievo, Postal Code 9143, 23 Sinchets Street
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="tel:+359898629156"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F5F8FA] hover:bg-white border border-[#D5DEE5] text-xs font-semibold text-[#1D2A36] shadow-xs hover:border-[#8995A1] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#007554]" />
              <span>+359898629156</span>
            </a>
            <a
              href="mailto:support@financialskool.com"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F5F8FA] hover:bg-white border border-[#D5DEE5] text-xs font-semibold text-[#1D2A36] shadow-xs hover:border-[#8995A1] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#007554]" />
              <span>support@financialskool.com</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F5F8FA] hover:bg-white border border-[#D5DEE5] text-xs font-semibold text-[#1D2A36] shadow-xs hover:border-[#8995A1] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#007554]" />
              <span>financialskool.com</span>
            </Link>
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#E3FFF3] border border-[#31F2BF]/30 text-xs font-bold text-[#007554]">
              <Lock className="w-3.5 h-3.5 text-[#007554]" />
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#1D2A36] hover:bg-[#132030] text-white font-extrabold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border border-[#132030]"
          >
            <span>View The Full Curriculum</span>
            <ArrowRight className="w-4 h-4 text-[#31F2BF]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
