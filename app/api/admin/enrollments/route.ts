import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const enrollments = await prisma.enrollment.findMany({
      orderBy: { enrolledAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error("Admin enrollments get error:", error);
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminUser = await getSessionUser();
    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "User ID and Course ID are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        status: "ACTIVE",
      },
      create: {
        userId,
        courseId,
        pricePaid: 0,
        paymentMethod: "MANUAL_ADMIN_GRANT",
        status: "ACTIVE",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, slug: true } },
      },
    });

    await prisma.activity.create({
      data: {
        userId,
        type: "ENROLLED",
        title: `Manual Grant: ${course.title}`,
        description: `Enrolled by administrator ${adminUser.name}.`,
      },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error("Admin create enrollment error:", error);
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
  }
}
