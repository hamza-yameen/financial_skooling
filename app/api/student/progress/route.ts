import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, completed } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Upsert lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completed: completed !== undefined ? completed : true,
        completedAt: completed ? new Date() : null,
        lastViewedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
        completed: completed !== undefined ? completed : true,
        completedAt: completed ? new Date() : null,
      },
    });

    // If completed, record activity
    if (completed) {
      await prisma.activity.create({
        data: {
          userId: user.id,
          type: "COMPLETED_LESSON",
          title: `Completed ${lesson.title}`,
          description: `Finished reading manual for ${lesson.moduleTitle} in ${lesson.course.title}.`,
        },
      });

      // Check if all lessons in course are completed
      const totalLessonsCount = lesson.course.lessons.length;
      const completedCount = await prisma.lessonProgress.count({
        where: {
          userId: user.id,
          completed: true,
          lesson: {
            courseId: lesson.courseId,
          },
        },
      });

      if (completedCount >= totalLessonsCount) {
        await prisma.enrollment.updateMany({
          where: {
            userId: user.id,
            courseId: lesson.courseId,
          },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });

        await prisma.activity.create({
          data: {
            userId: user.id,
            type: "COMPLETED_COURSE",
            title: `Graduated: ${lesson.course.title}`,
            description: `100% completion verified. All ${totalLessonsCount} technical modules mastered.`,
          },
        });
      }
    }

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
