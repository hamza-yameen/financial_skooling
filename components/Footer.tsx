import React from "react";
import Link from "next/link";
import BrandIcon from "./BrandIcon";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Lock,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#1A2B3B] bg-[#132030] text-[#8995A1] text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Top 4 Columns matching Increase.com structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <BrandIcon className="w-10 h-10 shadow-sm group-hover:scale-105 transition-all duration-300 rounded-xl" />
              <div>
                <h3 className="text-xl font-black tracking-tight text-white">
                  Financial <span className="text-[#31F2BF]">Skool</span>
                </h3>
                <p className="text-[11px] font-semibold text-[#8995A1] font-mono">
                  Education first. Always.
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#8995A1] leading-relaxed max-w-md font-medium">
              Practical, self-paced financial education and comprehensive PDF playbooks across cashflow
              architecture, credit repair, real estate math, and intelligent wealth systems.
            </p>
          </div>

          {/* Column 2: Curriculum */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Curriculum
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-[#8995A1]">
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-white transition-colors">
                  Financial Simulator
                </Link>
              </li>
              <li>
                <Link href="/about#doctrine" className="hover:text-white transition-colors">
                  Methodology & Doctrine
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Curriculum FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Member Access */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Member Access
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-[#8995A1]">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  New Student Registration
                </Link>
              </li>
              <li>
                <Link href="/student/dashboard" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/student/courses" className="hover:text-white transition-colors">
                  My Enrolled Courses
                </Link>
              </li>
              <li>
                <Link href="/student/activity" className="hover:text-white transition-colors">
                  Learning Activity
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-[#8995A1]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About the Academy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq#refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/faq#fulfillment" className="hover:text-white transition-colors">
                  Fulfillment & Delivery
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Registered Publisher Card - Increase Dark Slate */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0D1726] border border-[#314352] shadow-xs space-y-5">
          {/* Top row: REGISTERED PUBLISHER + Company Reg */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#31F2BF]/15 text-[#31F2BF] text-[11px] font-bold tracking-wider uppercase border border-[#31F2BF]/30 font-mono shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#31F2BF] animate-pulse" />
                REGISTERED PUBLISHER
              </span>
              <span className="text-base sm:text-lg font-black text-white tracking-tight">
                OMEGA IMPORT LTD
              </span>
            </div>

            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#1A2B3B] text-[#8995A1] text-xs font-mono font-bold border border-[#314352] shadow-xs">
              Company Reg: <strong className="text-white ml-1.5">208928597</strong>
            </span>
          </div>

          {/* Middle row: Address */}
          <div className="flex items-start sm:items-center gap-2.5 text-xs text-[#8995A1] font-medium">
            <MapPin className="w-4 h-4 text-[#31F2BF] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Bulgaria, Varna Province, Aksakovo Municipality, town of Ignatievo, Postal Code 9143, 23 Sinchets Street
            </span>
          </div>

          {/* Bottom row: Contact Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <a
              href="tel:+359898629156"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A2B3B] hover:bg-[#223548] border border-[#314352] text-xs font-semibold text-white shadow-xs hover:text-[#31F2BF] transition-all cursor-pointer font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-[#8995A1]" />
              <span>+359898629156</span>
            </a>

            <a
              href="mailto:support@financialskool.com"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A2B3B] hover:bg-[#223548] border border-[#314352] text-xs font-semibold text-white shadow-xs hover:text-[#31F2BF] transition-all cursor-pointer font-mono"
            >
              <Mail className="w-3.5 h-3.5 text-[#8995A1]" />
              <span>support@financialskool.com</span>
            </a>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A2B3B] hover:bg-[#223548] border border-[#314352] text-xs font-semibold text-white shadow-xs hover:text-[#31F2BF] transition-all font-mono"
            >
              <Globe className="w-3.5 h-3.5 text-[#8995A1]" />
              <span>financialskool.com</span>
            </Link>

            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#053226] border border-[#31F2BF]/30 text-xs font-bold text-[#31F2BF] shadow-xs font-mono">
              <Lock className="w-3.5 h-3.5 text-[#31F2BF]" />
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-4 border-t border-[#314352]">
          <p className="text-[11px] sm:text-xs leading-relaxed text-[#657482] font-normal text-center sm:text-left">
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
