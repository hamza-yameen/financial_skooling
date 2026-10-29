import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import LessonPlayer from "@/components/LessonPlayer";

export const dynamic = "force-dynamic";

export default async function StudentLessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?callbackUrl=/student/courses/${courseSlug}/learn/${lessonSlug}`);
  }

  // Fetch course, its lessons, and verify enrollment
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Verify enrollment (or allow admin to inspect)
  const isEnrolled =
    user.role === "ADMIN" ||
    (await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    }));

  if (!isEnrolled) {
    redirect(`/courses/${courseSlug}`);
  }

  // Find the requested lesson
  const currentLesson = course.lessons.find((l) => l.slug === lessonSlug);
  if (!currentLesson) {
    notFound();
  }

  // Fetch user completed lessons for this course
  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      userId: user.id,
      completed: true,
      lesson: { courseId: course.id },
    },
    select: { lessonId: true },
  });

  const completedLessonIds = completedProgress.map((p) => p.lessonId);

  return (
    <LessonPlayer
      course={course as any}
      currentLesson={currentLesson as any}
      initialCompletedLessonIds={completedLessonIds}
    />
  );
}

