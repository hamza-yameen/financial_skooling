import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const courses = await prisma.course.findMany({
      orderBy: { order: "asc" },
      include: {
        category: true,
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Admin courses get error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      tagline,
      summary,
      description,
      price,
      originalPrice,
      level,
      duration,
      format,
      published,
      featured,
      order,
      coverImage,
      badge,
      highlights,
      whatYouWillLearn,
      requirements,
      categoryId,
    } = body;

    if (!title || !slug || !price || !categoryId) {
      return NextResponse.json(
        { error: "Title, slug, price, and category are required" },
        { status: 400 }
      );
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        slug,
        tagline: tagline || "",
        summary: summary || "",
        description: description || "",
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        level: level || "BEGINNER",
        duration: duration || "4 Modules",
        format: format || "PDF-First + Interactive Lab",
        published: published ?? true,
        featured: featured ?? false,
        order: order ? parseInt(order, 10) : 0,
        coverImage: coverImage || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        badge: badge || null,
        highlights: Array.isArray(highlights) ? highlights : [],
        whatYouWillLearn: Array.isArray(whatYouWillLearn) ? whatYouWillLearn : [],
        requirements: Array.isArray(requirements) ? requirements : [],
        categoryId,
      },
    });

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error("Admin create course error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
