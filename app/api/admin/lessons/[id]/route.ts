import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.lesson.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        moduleTitle: body.moduleTitle,
        order: body.order !== undefined ? parseInt(body.order, 10) : undefined,
        duration: body.duration,
        summary: body.summary,
        content: body.content,
        pdfUrl: body.pdfUrl,
        isFreePreview: body.isFreePreview,
      },
    });

    return NextResponse.json({ success: true, lesson: updated });
  } catch (error) {
    console.error("Admin update lesson error:", error);
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete lesson error:", error);
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
  }
}
