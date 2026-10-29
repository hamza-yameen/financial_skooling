import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Lock,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#EBE2D6] bg-[#F7F2EB] text-[#636B58] text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Top 4 Columns matching the reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5C6E42] via-[#8B9B6D] to-[#BAC8A1] p-[2px] shadow-sm group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <span className="font-black text-xs text-[#5C6E42] font-mono">fs</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-[#1C2417]">
                  Financial <span className="text-gradient-primary">Skool</span>
                </h3>
                <p className="text-[11px] font-semibold text-[#7E8773]">
                  Education first. Always.
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#636B58] leading-relaxed max-w-md font-medium">
              Practical, self-paced financial education and comprehensive PDF playbooks across cashflow
              architecture, credit repair, real estate math, and intelligent wealth systems.
            </p>
          </div>

          {/* Column 2: Curriculum */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C2417]">
              Curriculum
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-[#636B58]">
              <li>
                <Link href="/courses" className="hover:text-[#5C6E42] transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-[#5C6E42] transition-colors">
                  Financial Simulator
                </Link>
              </li>
              <li>
                <Link href="/about#doctrine" className="hover:text-[#5C6E42] transition-colors">
                  Methodology & Doctrine
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#5C6E42] transition-colors">
                  Curriculum FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Member Access */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C2417]">
              Member Access
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-[#636B58]">
              <li>
                <Link href="/login" className="hover:text-[#5C6E42] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#5C6E42] transition-colors">
                  New Student Registration
                </Link>
              </li>
              <li>
                <Link href="/student/dashboard" className="hover:text-[#5C6E42] transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/student/courses" className="hover:text-[#5C6E42] transition-colors">
                  My Enrolled Courses
                </Link>
              </li>
              <li>
                <Link href="/student/activity" className="hover:text-[#5C6E42] transition-colors">
                  Learning Activity
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C2417]">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-[#636B58]">
              <li>
                <Link href="/about" className="hover:text-[#5C6E42] transition-colors">
                  About the Academy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#5C6E42] transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#5C6E42] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#5C6E42] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq#refund" className="hover:text-[#5C6E42] transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/faq#fulfillment" className="hover:text-[#5C6E42] transition-colors">
                  Fulfillment & Delivery
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Registered Publisher Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EBE2D6] shadow-xs space-y-5">
          {/* Top row: REGISTERED PUBLISHER + Company Reg */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B9B6D]/15 text-[#4A5836] text-[11px] font-bold tracking-wider uppercase border border-[#8B9B6D]/35 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#5C6E42] animate-pulse" />
                REGISTERED PUBLISHER
              </span>
              <span className="text-base sm:text-lg font-black text-[#1C2417] tracking-tight">
                OMEGA IMPORT LTD
              </span>
            </div>

            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#F7F2EB] text-[#636B58] text-xs font-mono font-bold border border-[#EBE2D6] shadow-xs">
              Company Reg: <strong className="text-[#1C2417] ml-1.5">208928597</strong>
            </span>
          </div>

          {/* Middle row: Address */}
          <div className="flex items-start sm:items-center gap-2.5 text-xs text-[#1C2417] font-medium">
            <MapPin className="w-4 h-4 text-[#5C6E42] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Bulgaria, Varna Province, Aksakovo Municipality, town of Ignatievo, Postal Code 9143, 23 Sinchets Street
            </span>
          </div>

          {/* Bottom row: Contact Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <a
              href="tel:+359898629156"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F7F2EB] hover:bg-[#EBE2D6] border border-[#EBE2D6] text-xs font-semibold text-[#1C2417] shadow-xs hover:text-[#5C6E42] transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#7E8773]" />
              <span>+359898629156</span>
            </a>

            <a
              href="mailto:support@financialskool.com"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F7F2EB] hover:bg-[#EBE2D6] border border-[#EBE2D6] text-xs font-semibold text-[#1C2417] shadow-xs hover:text-[#5C6E42] transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#7E8773]" />
              <span>support@financialskool.com</span>
            </a>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#F7F2EB] hover:bg-[#EBE2D6] border border-[#EBE2D6] text-xs font-semibold text-[#1C2417] shadow-xs hover:text-[#5C6E42] transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-[#7E8773]" />
              <span>financialskool.com</span>
            </Link>

            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#8B9B6D]/15 border border-[#8B9B6D]/35 text-xs font-bold text-[#4A5836] shadow-xs">
              <Lock className="w-3.5 h-3.5 text-[#5C6E42]" />
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-4 border-t border-[#EBE2D6]">
          <p className="text-[11px] sm:text-xs leading-relaxed text-[#7E8773] font-normal text-center sm:text-left">
            Educational and informational purposes only. Financial Skool provides educational curriculum,
            personal finance frameworks, and budgeting templates. Content does not constitute financial,
            investment, tax, or legal advice. All examples are hypothetical and for study only. © 2026
            OMEGA IMPORT LTD (Company Reg: 208928597). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
