import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CourseEnrollCard from "@/components/CourseEnrollCard";

export const dynamic = "force-dynamic";
import {
  CheckCircle2,
  Lock,
  Download,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  Star,
  Sparkles,
  ChevronRight,
  FileText,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true, summary: true },
  });

  if (!course) return { title: "Program Not Found" };

  return {
    title: `${course.title} — Financial Skool`,
    description: course.summary,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      lessons: {
        orderBy: { order: "asc" },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          lessons: true,
          enrollments: true,
          reviews: true,
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Group lessons by module
  const modulesMap = new Map<string, typeof course.lessons>();
  course.lessons.forEach((lesson) => {
    const mod = lesson.moduleTitle || "General Curriculum";
    if (!modulesMap.has(mod)) {
      modulesMap.set(mod, []);
    }
    modulesMap.get(mod)!.push(lesson);
  });

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#EDF1F5]">
      {/* Background ambient blooms */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[450px] bg-[#31F2BF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-[#34BCFF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono font-semibold text-[#657482] mb-8">
          <Link href="/" className="hover:text-[#007554] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8995A1]" />
          <Link href="/courses" className="hover:text-[#007554] transition-colors">
            Programs
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8995A1]" />
          <span className="text-[#1D2A36] truncate max-w-xs">{course.title}</span>
        </nav>

        {/* Main Grid: Content (8 cols) + Sticky Checkout Card (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details & Syllabus */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {course.badge && (
                  <span className="text-xs uppercase font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-[#132030] text-[#31F2BF] border border-[#31F2BF]/30 shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#31F2BF]" />
                    {course.badge}
                  </span>
                )}
                <span className="text-xs uppercase font-bold px-3 py-1 rounded-full bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/40">
                  {course.level}
                </span>
                <span className="text-xs font-mono font-semibold text-[#657482] bg-white border border-[#D5DEE5] px-3 py-1 rounded-full">
                  {course.category.name}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1D2A36] tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-[#657482] leading-relaxed font-normal">
                {course.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono font-semibold text-[#657482]">
                <span className="flex items-center gap-1.5 text-[#007554]">
                  <BookOpen className="w-4 h-4" />
                  {course.lessons.length} Technical Manuals
                </span>
                <span className="flex items-center gap-1.5 text-[#657482]">
                  <Clock className="w-4 h-4 text-[#8995A1]" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1.5 text-[#1D2A36]">
                  <ShieldCheck className="w-4 h-4 text-[#007554]" />
                  Lifetime Access License
                </span>
              </div>
            </div>

            {/* Core Competencies Card */}
            <div className="p-7 rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-4">
              <h3 className="text-lg font-black text-[#1D2A36] tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#007554]" />
                Core Competencies & Execution Takeaways
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1D2A36]">
                    <CheckCircle2 className="w-4 h-4 text-[#007554] shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Course Description */}
            <div className="p-7 rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-[#1D2A36] tracking-tight">
                Architecture & Operating Doctrine
              </h3>
              <div className="prose max-w-none text-[#657482] text-sm leading-relaxed whitespace-pre-line space-y-4">
                {course.description}
              </div>
            </div>

            {/* Complete Syllabus Accordion */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-[#1D2A36] tracking-tight">
                  Structured Curriculum Syllabus
                </h3>
                <p className="text-xs text-[#657482] mt-1 font-medium">
                  {course.lessons.length} Modules • Exhaustive PDF-first field manuals & calculators
                </p>
              </div>

              <div className="space-y-4">
                {Array.from(modulesMap.entries()).map(([moduleTitle, moduleLessons], modIdx) => (
                  <div
                    key={modIdx}
                    className="rounded-xl border border-[#D5DEE5] bg-white overflow-hidden shadow-xs"
                  >
                    <div className="p-4 bg-[#F5F8FA] border-b border-[#D5DEE5] flex items-center justify-between text-xs font-bold text-[#1D2A36]">
                      <span className="font-mono text-[#1D2A36]">{moduleTitle}</span>
                      <span className="text-[11px] text-[#657482] font-mono">
                        {moduleLessons.length} Lesson{moduleLessons.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="divide-y divide-[#EDF1F5]">
                      {moduleLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-4 flex items-start sm:items-center justify-between gap-4 hover:bg-[#F5F8FA]/70 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 text-[#1D2A36] text-xs font-mono font-bold">
                              {lesson.order}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-[#1D2A36]">
                                  {lesson.title}
                                </h4>
                                {lesson.isFreePreview && (
                                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/40">
                                    Free Preview
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#657482] mt-0.5 line-clamp-1">
                                {lesson.summary}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-mono text-[#8995A1]">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements & Target Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-[#1D2A36] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#007554]" />
                  Prerequisites & Preparation
                </h4>
                <ul className="space-y-2 text-xs text-[#657482]">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#007554] font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-[#1D2A36] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#007554]" />
                  Target Audience
                </h4>
                <p className="text-xs text-[#657482] leading-relaxed">
                  Engineered specifically for private balance sheet operators, quantitative analysts,
                  commercial real estate syndicators, and digital founders seeking systematic financial
                  disciplines.
                </p>
              </div>
            </div>

            {/* Student Reviews */}
            {course.reviews.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#D5DEE5]">
                <h3 className="text-2xl font-black text-[#1D2A36] tracking-tight">
                  Verified Operator Feedback
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-2.5"
                    >
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                        ))}
                      </div>
                      <p className="text-xs text-[#1D2A36] italic leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                      <div className="pt-2 text-[11px] font-mono font-bold text-[#007554]">
                        {rev.studentName} — {rev.studentRole || "Student"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Enrollment Card */}
          <div className="lg:col-span-4">
            <CourseEnrollCard
              course={{
                id: course.id,
                title: course.title,
                slug: course.slug,
                price: course.price,
                originalPrice: course.originalPrice,
                duration: course.duration,
                coverImage: course.coverImage,
                highlights: course.highlights,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
