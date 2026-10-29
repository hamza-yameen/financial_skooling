import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF documents (.pdf) are permitted" },
        { status: 400 }
      );
    }

    // Ensure lessons directory exists in project root
    const rootLessonsDir = path.join(process.cwd(), "lessons");
    await fs.mkdir(rootLessonsDir, { recursive: true });

    // Generate safe clean filename
    const sanitizedOriginal = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/-+/g, "-");
    const uniqueFileName = `${Date.now()}-${sanitizedOriginal}`;
    const destinationPath = path.join(rootLessonsDir, uniqueFileName);

    // Read bytes and write to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(destinationPath, buffer);

    const downloadUrl = `/api/lessons/download/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      fileName: uniqueFileName,
      originalName: file.name,
      fileSize: buffer.length,
      downloadUrl,
    });
  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload and save PDF to lessons directory" },
      { status: 500 }
    );
  }
}

