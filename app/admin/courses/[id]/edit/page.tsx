import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CourseForm from "@/components/CourseForm";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [course, categories] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#5C6E42]">
          PROGRAM CONFIGURATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2417] tracking-tight mt-1">
          Edit: {course.title}
        </h1>
        <p className="text-xs text-[#4A5836] mt-1">
          Modify syllabus parameters, pricing, and architectural manual descriptions.
        </p>
      </div>

      <CourseForm categories={categories} initialData={course as any} />
    </div>
  );
}
