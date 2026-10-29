import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminCoursesList from "@/components/AdminCoursesList";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Courses Management — Financial Skool Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      category: { select: { id: true, name: true } },
      _count: {
        select: { lessons: true, enrollments: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE2D6]">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#5C6E42]">
            CURRICULUM MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2417] tracking-tight mt-1">
            Courses & Programs CRUD
          </h1>
          <p className="text-xs text-[#4A5836] mt-1">
            Create, reorder, publish, and configure dynamic educational programs.
          </p>
        </div>

        <Link
          href="/admin/courses/new"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Program
        </Link>
      </div>

      <AdminCoursesList initialCourses={courses as any} />
    </div>
  );
}
