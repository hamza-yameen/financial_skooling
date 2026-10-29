import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalStudents,
      totalCourses,
      totalEnrollments,
      revenueResult,
      recentEnrollments,
      recentActivities,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.enrollment.aggregate({
        _sum: {
          pricePaid: true,
        },
      }),
      prisma.enrollment.findMany({
        take: 6,
        orderBy: { enrolledAt: "desc" },
        include: {
          user: { select: { name: true, email: true, avatar: true } },
          course: { select: { title: true, price: true, currency: true } },
        },
      }),
      prisma.activity.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, role: true } },
        },
      }),
    ]);

    const completedEnrollments = await prisma.enrollment.count({
      where: { status: "COMPLETED" },
    });

    const completionRate =
      totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100)
        : 0;

    return NextResponse.json({
      metrics: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalRevenue: revenueResult._sum.pricePaid || 0,
        completionRate,
      },
      recentEnrollments,
      recentActivities,
    });
  } catch (error) {
    console.error("Admin metrics error:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
