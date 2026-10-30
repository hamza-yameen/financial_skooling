import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.creditPackage.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { price: "asc" }],
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error("Public credit packages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit packages" },
      { status: 500 }
    );
  }
}

