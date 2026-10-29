import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, CheckCircle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Financial Skool",
  description:
    "Privacy and data protection policy for Financial Skool, operated by OMEGA IMPORT LTD in compliance with European GDPR standards.",
};

export default function PrivacyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#5C6E42]" />
            DATA PRIVACY & GDPR COMPLIANCE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1C2417]">
            Privacy <span className="text-gradient-primary">Policy</span>
          </h1>
          <p className="text-xs text-[#7E8773] font-mono">
            Last Updated: January 2026 • Published by OMEGA IMPORT LTD
          </p>
        </div>

        {/* Content Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EBE2D6] shadow-sm space-y-8 text-sm text-[#4A5836] leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">1. Introduction & Scope</h2>
            <p>
              OMEGA IMPORT LTD (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates{" "}
              <strong>financialskool.com</strong>. We are committed to protecting your personal data
              and respecting your privacy in strict accordance with the General Data Protection
              Regulation (EU GDPR) and applicable data protection regulations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">2. Information We Collect</h2>
            <p>We only collect information strictly required to deliver our educational services:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong>Account Credentials:</strong> Name, email address, and encrypted password hash
                for authentication and license management.
              </li>
              <li>
                <strong>Purchase History:</strong> Information regarding the specific educational modules
                licensed and timestamp of fulfillment.
              </li>
              <li>
                <strong>Support Communications:</strong> Inquiries submitted via our contact forms or
                support desk.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">3. Payment Data Security</h2>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                256-BIT SSL ENCRYPTION & TOKENIZATION
              </div>
              <p>
                We never store, capture, or have access to your raw payment card numbers. All payments are
                processed through PCI-DSS Level 1 compliant financial gateways with bank-grade encryption.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">4. How We Use Your Data</h2>
            <p>Your data is processed exclusively to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Provision access to your Student Dashboard and download links.</li>
              <li>Maintain your course completion records and learning activity.</li>
              <li>Respond to support inquiries and process refund requests.</li>
              <li>Prevent unauthorized account sharing and platform abuse.</li>
            </ul>
            <p className="text-xs pt-1">
              <strong>We never sell, rent, or monetize your personal information to third parties.</strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">5. Your Rights Under GDPR</h2>
            <p>Under EU GDPR law, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Request a copy of personal information we hold about you.</li>
              <li>Request correction of inaccurate or incomplete records.</li>
              <li>Request complete erasure of your student account and personal data.</li>
              <li>Withdraw consent for any non-essential data processing at any time.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-[#1C2417]">6. Contact Data Controller</h2>
            <p>
              For any privacy-related requests or data deletion demands, please reach our Data Protection Officer:
            </p>
            <div className="p-4 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6] text-xs space-y-1 font-mono text-[#1C2417]">
              <p className="font-bold">OMEGA IMPORT LTD</p>
              <p>Attn: Data Privacy Officer</p>
              <p>Company Registration: 208928597</p>
              <p>Address: Bulgaria, Varna Province, Aksakovo Municipality, town of Ignatievo, Postal Code 9143, 23 Sinchets Street</p>
              <p>Email: support@financialskool.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

