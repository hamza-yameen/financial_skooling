import React from "react";
import { prisma } from "@/lib/prisma";
import AdminStudentsManager from "@/components/AdminStudentsManager";

export const metadata = {
  title: "Students & Operators Directory — Financial Skool Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const students = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          enrollments: true,
          lessonProgress: true,
          activities: true,
        },
      },
      enrollments: {
        select: {
          id: true,
          course: { select: { title: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#5C6E42]">
          STUDENT DIRECTORY
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2417] tracking-tight mt-1">
          Registered Operators & Roles
        </h1>
        <p className="text-xs text-[#4A5836] mt-1">
          Manage enrolled students, monitor learning velocity, and promote team administrators.
        </p>
      </div>

      <AdminStudentsManager initialStudents={students as any} />
    </div>
  );
}
