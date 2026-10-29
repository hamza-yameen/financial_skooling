import React from "react";
import { prisma } from "@/lib/prisma";
import CoursesCatalog from "@/components/CoursesCatalog";
import { Layers, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Programs & Specialized Labs — Financial Skool",
  description:
    "Explore our complete curriculum of PDF-first wealth playbooks, real estate deal underwriting labs, and quantitative execution engines.",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { lessons: true, enrollments: true },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background ambient pastel blooms */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[400px] bg-[#8B9B6D]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-80 right-[-100px] w-[500px] h-[500px] bg-[#BAC8A1]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B9B6D]/10 border border-[#8B9B6D]/30 text-xs font-mono font-bold text-[#384524] uppercase tracking-widest shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#5C6E42]" />
            SYSTEMATIC FINANCIAL CURRICULUM
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1C2417]">
            Programs & <span className="text-gradient-primary">Specialized Labs</span>
          </h1>
          <p className="text-base text-[#4A5836] leading-relaxed font-medium">
            Every program is structured around dense, actionable PDF manuals and production spreadsheet
            underwriting engines. One-time purchase, zero monthly lock-in.
          </p>
        </div>

        {/* Interactive Catalog Component */}
        <CoursesCatalog courses={courses as any} categories={categories} />
      </div>
    </div>
  );
}
