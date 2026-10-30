import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LandingHero from "@/components/LandingHero";
import RiskSimulator from "@/components/RiskSimulator";
import HomeCourseCardFooter from "@/components/HomeCourseCardFooter";

export const dynamic = "force-dynamic";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Cpu,
  Building2,
  FileText,
  BarChart3,
  Layers,
  ChevronRight,
  Star,
  Users,
  Clock,
} from "lucide-react";

export default async function HomePage() {
  // Fetch published courses from PostgreSQL
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      category: true,
      _count: {
        select: { lessons: true, enrollments: true, reviews: true },
      },
    },
  });

  const reviews = await prisma.review.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { title: true } },
    },
  });

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#EDF1F5]">
      {/* Background Ambient Blooms for Middle & Lower Sections */}
      <div className="absolute top-[900px] left-[-200px] w-[500px] h-[500px] bg-[#31F2BF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[1700px] right-[-200px] w-[600px] h-[600px] bg-[#34BCFF]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Modern High-Impact Hero Section matching Reference (100% Full Width with Embedded Header) */}
      <LandingHero />

      {/* Live Metrics Ticker Bar - Increase Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 mb-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#D5DEE5] shadow-sm">
          <div className="p-4 text-center sm:text-left">
            <p className="text-[11px] uppercase font-mono font-bold text-[#657482]">Simulated Volume</p>
            <p className="text-3xl font-black text-[#1D2A36] mt-1 tracking-tight font-mono">€1.8M+</p>
            <p className="text-xs font-semibold text-[#007554] mt-0.5">Across 10k+ risk runs</p>
          </div>
          <div className="p-4 text-center sm:text-left">
            <p className="text-[11px] uppercase font-mono font-bold text-[#657482]">Curriculum Depth</p>
            <p className="text-3xl font-black text-[#1D2A36] mt-1 tracking-tight font-mono">56+ Pages</p>
            <p className="text-xs font-semibold text-[#657482] mt-0.5">Structured technical manuals</p>
          </div>
          <div className="p-4 text-center sm:text-left">
            <p className="text-[11px] uppercase font-mono font-bold text-[#657482]">Subscription Trap</p>
            <p className="text-3xl font-black text-[#007554] mt-1 tracking-tight font-mono">0% Monthly</p>
            <p className="text-xs font-semibold text-[#657482] mt-0.5">Never recurring rebilled</p>
          </div>
          <div className="p-4 text-center sm:text-left">
            <p className="text-[11px] uppercase font-mono font-bold text-[#657482]">Operator Rating</p>
            <p className="text-3xl font-black text-[#1D2A36] mt-1 tracking-tight font-mono">4.9 / 5.0</p>
            <p className="text-xs font-semibold text-[#007554] mt-0.5">Verified operator feedback</p>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#D5DEE5]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#007554] uppercase tracking-widest font-bold mb-2">
              <Layers className="w-3.5 h-3.5" />
              DYNAMIC CURRICULUM & LABS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1D2A36]">
              Institutional Programs & Specialized Labs
            </h2>
            <p className="text-sm text-[#657482] mt-1 max-w-xl font-medium">
              Engineered as definitive operational manuals. Every program unlocks instant, permanent
              student dashboard access with live tools and spreadsheet files.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007554] hover:text-[#053226]"
          >
            Browse all specialized labs
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl bg-white border border-[#D5DEE5] p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-[#0C1927]/08 hover:border-[#8995A1] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Color Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1D2A36] via-[#007554] to-[#31F2BF] opacity-85 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/40 font-mono">
                    {course.category.name}
                  </span>
                  {course.badge && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EDF1F5] text-[#334352] border border-[#D5DEE5] shadow-xs flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3 text-[#007554]" />
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-xl font-extrabold text-[#1D2A36] group-hover:text-[#007554] transition-colors tracking-tight line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#657482] mt-2 line-clamp-2 leading-relaxed font-medium">
                    {course.summary}
                  </p>
                </div>

                {/* Key Metadata Stats */}
                <div className="flex items-center gap-3 text-xs font-mono font-medium text-[#657482] py-1 border-y border-[#D5DEE5]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#007554]" />
                    {course._count.lessons} Modules
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#657482]" />
                    {course.duration}
                  </span>
                </div>

                {/* Highlights List */}
                <ul className="space-y-2 text-xs text-[#657482] pt-1">
                  {course.highlights.slice(0, 2).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007554] shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-medium text-[#1D2A36]">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Footer & Price with dynamic currency & cart */}
              <HomeCourseCardFooter course={course} />
            </div>
          ))}
        </div>
      </section>

      {/* Embedded Interactive Risk Simulator Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#D5DEE5]">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#007554] uppercase tracking-widest font-bold">
            <Cpu className="w-3.5 h-3.5" />
            STANDALONE PROPRIETARY ENGINE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1D2A36]">
            Interactive Risk & Drawdown Simulator
          </h2>
          <p className="text-sm text-[#657482] font-medium">
            Before executing in live financial markets or underwriting property loans, test your
            mathematical expectancy and risk envelope below.
          </p>
        </div>

        {/* Live Simulator Component */}
        <RiskSimulator />

        <div className="text-center mt-6">
          <Link
            href="/simulator"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#007554] hover:text-[#053226]"
          >
            Open Fullscreen Simulator Dashboard with Advanced Kelly Analysis
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* The 4 Architectural Pillars Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#D5DEE5]">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#007554] uppercase tracking-widest font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            THE FOUR CORE PILLARS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1D2A36]">
            How Financial Skool Operates
          </h2>
          <p className="text-sm text-[#657482] font-medium">
            A cohesive trajectory designed to build resilient, asymmetric balance sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-[#D5DEE5] shadow-xs space-y-4 hover:shadow-xl hover:shadow-[#0C1927]/06 hover:border-[#8995A1] hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#EDF1F5] border border-[#D5DEE5] flex items-center justify-center text-[#1D2A36] font-black font-mono text-lg">
              01
            </div>
            <h3 className="text-base font-extrabold text-[#1D2A36]">
              Wealth & Credit Architecture
            </h3>
            <p className="text-xs text-[#657482] leading-relaxed font-medium">
              Household liquidity reservoirs, tier-1 commercial banking relationships, and non-recourse debt stacking.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[#D5DEE5] shadow-xs space-y-4 hover:shadow-xl hover:shadow-[#0C1927]/06 hover:border-[#8995A1] hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#EDF1F5] border border-[#D5DEE5] flex items-center justify-center text-[#1D2A36] font-black font-mono text-lg">
              02
            </div>
            <h3 className="text-base font-extrabold text-[#1D2A36]">
              Real Estate Underwriting
            </h3>
            <p className="text-xs text-[#657482] leading-relaxed font-medium">
              Cap rate variance, NOI equations, DSCR covenant stress-testing, and dynamic private syndication waterfalls.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[#D5DEE5] shadow-xs space-y-4 hover:shadow-xl hover:shadow-[#0C1927]/06 hover:border-[#8995A1] hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#EDF1F5] border border-[#D5DEE5] flex items-center justify-center text-[#1D2A36] font-black font-mono text-lg">
              03
            </div>
            <h3 className="text-base font-extrabold text-[#1C2417]">
              Digital Business Engines
            </h3>
            <p className="text-xs text-[#636B58] leading-relaxed font-medium">
              Zero marginal cost digital distribution, automated webhook funnels, and programmatic financial research pipelines.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-[#EBE2D6] shadow-xs space-y-4 hover:shadow-xl hover:shadow-[#8B9B6D]/15 hover:border-[#8B9B6D]/50 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#8B9B6D]/15 border border-[#8B9B6D]/30 flex items-center justify-center text-[#4A5836] font-black font-mono text-lg">
              04
            </div>
            <h3 className="text-base font-extrabold text-[#1C2417]">
              Systematic Quant Frameworks
            </h3>
            <p className="text-xs text-[#636B58] leading-relaxed font-medium">
              Fractional Kelly sizing, Monte Carlo permutation testing, market microstructure, and strict drawdown bounds.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison: Financial Skool vs Generic Online Courses */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#EBE2D6]">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#5C6E42] uppercase tracking-widest font-bold">
            <BarChart3 className="w-3.5 h-3.5 text-[#8B9B6D]" />
            STANDARDS & INTEGRITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1C2417]">
            The Financial Skool Distinction
          </h2>
          <p className="text-sm text-[#4A5836] font-medium">
            Why serious operators prefer our manual-first architecture over mainstream course traps.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#EBE2D6] rounded-3xl overflow-hidden bg-white shadow-sm">
            <thead>
              <tr className="border-b border-[#EBE2D6] bg-[#F7F2EB] font-mono text-[#1C2417]">
                <th className="py-4 px-6 font-bold">Evaluation Criteria</th>
                <th className="py-4 px-6 text-[#2E3C1B] font-extrabold bg-[#8B9B6D]/15">
                  Financial Skool
                </th>
                <th className="py-4 px-6 text-slate-500">Generic Influencer Programs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE2D6]/70 text-[#1C2417] font-medium">
              <tr>
                <td className="py-4 px-6 font-bold text-[#1C2417]">Curriculum Medium</td>
                <td className="py-4 px-6 font-bold text-[#384524] bg-[#8B9B6D]/10">
                  PDF-First Concise Manuals (14+ pages each)
                </td>
                <td className="py-4 px-6 text-slate-400">20+ hours of rambling, low-density video</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-[#1C2417]">Billing Model</td>
                <td className="py-4 px-6 font-bold text-[#384524] bg-[#8B9B6D]/10">
                  One-time transparent fee • Lifetime access
                </td>
                <td className="py-4 px-6 text-slate-400">Auto-renewing recurring membership traps</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-[#1C2417]">Risk Strategy</td>
                <td className="py-4 px-6 font-bold text-[#384524] bg-[#8B9B6D]/10">
                  Mathematical Kelly sizing & Monte Carlo ruin bounds
                </td>
                <td className="py-4 px-6 text-slate-400">Subjective guessing & emotional FOMO</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-[#1C2417]">Spreadsheets & Code</td>
                <td className="py-4 px-6 font-bold text-[#384524] bg-[#8B9B6D]/10">
                  Production pro formas & backtest engines (.xlsx & code)
                </td>
                <td className="py-4 px-6 text-slate-400">Generic screenshots and motivational speeches</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-[#1C2417]">Market Signals</td>
                <td className="py-4 px-6 font-bold text-[#384524] bg-[#8B9B6D]/10">
                  Zero signals • Focus on autonomous skill mechanics
                </td>
                <td className="py-4 px-6 text-slate-400">Unregulated Telegram signal pump groups</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Verified Student Feedback */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#EBE2D6]">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#5C6E42] uppercase tracking-widest font-bold">
            <Star className="w-3.5 h-3.5 text-[#8B9B6D]" />
            STUDENT & ALUMNI FEEDBACK
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1C2417]">
            Tested in High-Stakes Environments
          </h2>
          <p className="text-sm text-[#4A5836] font-medium">
            Read real perspectives from Financial Skool graduates, entrepreneurs, and independent investors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-7 rounded-3xl border border-[#EBE2D6] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-[#8B9B6D]/15 hover:border-[#8B9B6D] hover:-translate-y-1 transition-all">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#8B9B6D]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#8B9B6D]" />
                  ))}
                </div>
                <p className="text-xs text-[#1C2417] leading-relaxed italic font-medium">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#EBE2D6]/70 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1C2417]">{rev.studentName}</h4>
                  <p className="text-[11px] text-[#5C6E42] font-mono font-semibold">{rev.studentRole || "Verified Student"}</p>
                </div>
                <span className="text-[10px] text-[#384524] bg-[#8B9B6D]/15 px-2.5 py-0.5 rounded-full border border-[#8B9B6D]/30 font-mono font-bold">Verified License</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#EBE2D6]">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1C2417]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#4A5836] font-medium">
            Everything you need to know about access, delivery, and curriculum structure.
          </p>
        </div>

        <div className="space-y-4">
          <details className="group p-6 rounded-2xl bg-white border border-[#EBE2D6] shadow-xs open:border-[#8B9B6D] transition-colors">
            <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-[#1C2417] list-none">
              Do I receive instant access upon enrollment?
              <ChevronRight className="w-4 h-4 text-[#8B9B6D] group-open:rotate-90 transition-transform" />
            </summary>
            <p className="text-xs text-[#4A5836] mt-3 leading-relaxed font-medium">
              Yes. The instant your transaction is authorized, your account is provisioned with
              lifetime access to your dedicated Student Dashboard. All PDF field manuals, Excel pro
              formas, and interactive simulators unlock immediately.
            </p>
          </details>

          <details className="group p-6 rounded-2xl bg-white border border-[#EBE2D6] shadow-xs open:border-[#8B9B6D] transition-colors">
            <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-[#1C2417] list-none">
              Why is the curriculum designed as PDF-First manuals rather than videos?
              <ChevronRight className="w-4 h-4 text-[#8B9B6D] group-open:rotate-90 transition-transform" />
            </summary>
            <p className="text-xs text-[#4A5836] mt-3 leading-relaxed font-medium">
              Serious students and wealth builders do not learn practical financial mechanics from 40-minute talking-head
              videos. A structured 14 to 20-page field manual provides dense, searchable equations,
              pro forma balance sheets, and execution checklists that you can reference during actual
              transactions.
            </p>
          </details>

          <details className="group p-6 rounded-2xl bg-white border border-[#EBE2D6] shadow-xs open:border-[#8B9B6D] transition-colors">
            <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-[#1C2417] list-none">
              Are there any recurring membership or subscription charges?
              <ChevronRight className="w-4 h-4 text-[#8B9B6D] group-open:rotate-90 transition-transform" />
            </summary>
            <p className="text-xs text-[#4A5836] mt-3 leading-relaxed font-medium">
              None. Financial Skool strictly rejects monthly subscription traps. Every program and lab is
              acquired via a single, one-time payment for perpetual access, including future edition
              updates.
            </p>
          </details>

          <details className="group p-6 rounded-2xl bg-white border border-[#EBE2D6] shadow-xs open:border-[#8B9B6D] transition-colors">
            <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-[#1C2417] list-none">
              Do you provide live investment signals or fund management?
              <ChevronRight className="w-4 h-4 text-[#8B9B6D] group-open:rotate-90 transition-transform" />
            </summary>
            <p className="text-xs text-[#4A5836] mt-3 leading-relaxed font-medium">
              No. We are strictly an educational academy. We do not issue buy/sell trade alerts,
              manage external investor funds, or operate brokerage services. Our sole mission is to
              teach practical personal finance and systematic wealth frameworks.
            </p>
          </details>
        </div>
      </section>

      {/* Final High-Impact CTA Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden bg-gradient-to-r from-[#3D4C2B] via-[#5C6E42] to-[#76885A] shadow-2xl shadow-[#5C6E42]/25 border border-[#8B9B6D]/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#BAC8A1]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F7F2EB] font-bold bg-white/15 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
              BEGIN YOUR FINANCIAL EDUCATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Build Long-Term Wealth & Financial Independence?
            </h2>
            <p className="text-sm text-[#F7F2EB]/90 leading-relaxed font-medium">
              Enroll in the flagship Master Program today or explore specialized quant and real estate
              labs. Instant access, zero subscriptions.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/courses/master-program-wealth-systems"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#2E3C1B] font-extrabold text-sm shadow-xl shadow-black/10 hover:bg-[#F7F2EB] hover:scale-[1.03] active:scale-95 transition-all text-center"
              >
                Enroll in Flagship Master Program
              </Link>
              <Link
                href="/courses"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all text-center backdrop-blur-xs"
              >
                View All Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
