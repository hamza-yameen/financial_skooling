import React from "react";
import Link from "next/link";
import { FileText, Shield, Scale, AlertCircle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Financial Skool",
  description:
    "Terms of service, educational disclaimers, and user agreements for Financial Skool, operated by OMEGA IMPORT LTD.",
};

export default function TermsPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background ambient blooms */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[450px] bg-[#8B9B6D]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C6E42] hover:text-[#384524] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B9B6D]/10 border border-[#8B9B6D]/30 text-xs font-mono font-bold text-[#384524] uppercase tracking-widest shadow-xs">
            <Scale className="w-3.5 h-3.5 text-[#5C6E42]" />
            LEGAL AGREEMENT & TERMS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1C2417]">
            Terms of <span className="text-gradient-primary">Service</span>
          </h1>
          <p className="text-xs text-[#7E8773] font-mono">
            Last Updated: January 2026 • Published by OMEGA IMPORT LTD
          </p>
        </div>

        {/* Content Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EBE2D6] shadow-sm space-y-8 text-sm text-[#4A5836] leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or purchasing materials on Financial Skool (
              <strong>financialskool.com</strong>), you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree with any of these terms,
              you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">2. Educational Purpose & Disclaimer</h2>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                IMPORTANT REGULATORY DISCLOSURE
              </div>
              <p>
                Financial Skool provides educational curriculum, personal finance frameworks, and budgeting
                templates. Content does not constitute financial, investment, tax, or legal advice. All
                examples, spreadsheets, and simulations are hypothetical and intended solely for study.
              </p>
            </div>
            <p>
              OMEGA IMPORT LTD is not a broker-dealer, registered investment advisor, certified financial
              planner, or legal counsel. No information on this website or within our field manuals should
              be construed as a recommendation to buy or sell securities, execute specific real estate
              transactions, or adopt particular tax strategies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">3. One-Time Purchase & Lifetime Digital License</h2>
            <p>
              Purchases made on Financial Skool are strictly one-time transactions granting you a perpetual,
              non-exclusive, non-transferable license to access and download the purchased educational PDF manuals
              and accompanying spreadsheet models for personal study.
            </p>
            <p>
              There are no recurring subscription fees, hidden renewal charges, or mandatory maintenance costs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">4. Intellectual Property & Prohibited Uses</h2>
            <p>
              All curriculum texts, graphics, diagrams, spreadsheets, code notebooks, and PDF manuals are the
              exclusive intellectual property of OMEGA IMPORT LTD. You agree not to reproduce, resell, redistribute,
              publicly display, or create derivative commercial offerings from any materials obtained through
              Financial Skool without express written authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">5. Satisfaction Guarantee & Refunds</h2>
            <p>
              We stand behind our educational quality with an unconditional 14-day satisfaction guarantee.
              If our field manuals do not provide actionable technical clarity, you may contact{" "}
              <a href="mailto:support@financialskool.com" className="text-[#5C6E42] font-bold hover:underline">
                support@financialskool.com
              </a>{" "}
              within 14 days of purchase for a full refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">6. Publisher Information & Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of Bulgaria and the European
              Union. All operations are published and maintained by:
            </p>
            <div className="p-4 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6] text-xs space-y-1 font-mono text-[#1C2417]">
              <p className="font-bold">OMEGA IMPORT LTD</p>
              <p>Company Registration: 208928597</p>
              <p>Address: Bulgaria, Varna Province, Aksakovo Municipality, town of Ignatievo, Postal Code 9143, 23 Sinchets Street</p>
              <p>Email: support@financialskool.com | Phone: +359898629156</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

