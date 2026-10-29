import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: courseId } = await params;
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("Admin get lessons error:", error);
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: courseId } = await params;
    const body = await request.json();
    const { title, slug, moduleTitle, order, duration, summary, content, pdfUrl, isFreePreview } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Lesson title and slug are required" },
        { status: 400 }
      );
    }

    const newLesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        slug,
        moduleTitle: moduleTitle || "Module 1",
        order: order ? parseInt(order, 10) : 0,
        duration: duration || "20 mins",
        summary: summary || "",
        content: content || "",
        pdfUrl: pdfUrl || null,
        isFreePreview: isFreePreview ?? false,
      },
    });

    return NextResponse.json({ success: true, lesson: newLesson });
  } catch (error) {
    console.error("Admin create lesson error:", error);
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}
