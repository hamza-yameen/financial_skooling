import React from "react";
import { prisma } from "@/lib/prisma";
import CourseForm from "@/components/CourseForm";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#5C6E42]">
          NEW CURRICULUM
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2417] tracking-tight mt-1">
          Create New Program / Lab
        </h1>
        <p className="text-xs text-[#4A5836] mt-1">
          Publish a new educational program with custom pricing, highlights, and manual specifications.
        </p>
      </div>

      <CourseForm categories={categories} />
    </div>
  );
}
