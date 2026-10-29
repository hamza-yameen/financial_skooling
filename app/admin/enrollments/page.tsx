import React from "react";
import { prisma } from "@/lib/prisma";
import AdminEnrollmentsManager from "@/components/AdminEnrollmentsManager";

export const dynamic = "force-dynamic";


export default async function AdminEnrollmentsPage() {
  const [enrollments, students, courses] = await Promise.all([
    prisma.enrollment.findMany({
      orderBy: { enrolledAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, price: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.course.findMany({
      select: { id: true, title: true, price: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminEnrollmentsManager
        initialEnrollments={enrollments as any}
        students={students}
        courses={courses}
      />
    </div>
  );
}
