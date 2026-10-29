import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const level = searchParams.get("level");
    const search = searchParams.get("search");

    const where: any = {
      published: true,
    };

    if (categorySlug && categorySlug !== "all") {
      where.category = {
        slug: categorySlug,
      };
    }

    if (level && level !== "all") {
      where.level = level;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        category: true,
        lessons: {
          select: {
            id: true,
            title: true,
            slug: true,
            duration: true,
            isFreePreview: true,
          },
          orderBy: { order: "asc" },
        },
        reviews: {
          take: 3,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Public courses fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
