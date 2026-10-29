import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminLessonsManager from "@/components/AdminLessonsManager";

export const dynamic = "force-dynamic";

export default async function AdminCourseLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminLessonsManager course={course as any} />
    </div>
  );
}

