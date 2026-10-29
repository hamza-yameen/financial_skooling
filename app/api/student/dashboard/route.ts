import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch enrollments with course and lessons
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      orderBy: { enrolledAt: "desc" },
      include: {
        course: {
          include: {
            category: true,
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                slug: true,
                moduleTitle: true,
                order: true,
                duration: true,
              },
            },
          },
        },
      },
    });

    // Fetch completed lesson progress for this user
    const userProgress = await prisma.lessonProgress.findMany({
      where: { userId: user.id },
    });

    const completedLessonIds = new Set(
      userProgress.filter((p) => p.completed).map((p) => p.lessonId)
    );

    // Compute progress per enrolled course
    const enrichedCourses = enrollments.map((enr) => {
      const course = enr.course;
      const totalLessons = course.lessons.length;
      const completedCount = course.lessons.filter((l) =>
        completedLessonIds.has(l.id)
      ).length;
      const percentage =
        totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      // Find first incomplete lesson or first lesson
      const nextLesson =
        course.lessons.find((l) => !completedLessonIds.has(l.id)) ||
        course.lessons[0] ||
        null;

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        badge: course.badge,
        category: course.category.name,
        coverImage: course.coverImage,
        duration: course.duration,
        format: course.format,
        enrolledAt: enr.enrolledAt,
        status: enr.status,
        totalLessons,
        completedLessons: completedCount,
        progressPercentage: percentage,
        nextLessonSlug: nextLesson ? nextLesson.slug : null,
        nextLessonTitle: nextLesson ? nextLesson.title : null,
      };
    });

    // Recent activities
    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    const totalCompletedLessons = userProgress.filter((p) => p.completed).length;

    return NextResponse.json({
      user,
      enrolledCourses: enrichedCourses,
      stats: {
        totalEnrolled: enrollments.length,
        totalCompletedLessons,
        learningStreakDays: 5,
      },
      activities,
    });
  } catch (error) {
    console.error("Student dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch student dashboard" },
      { status: 500 }
    );
  }
}
