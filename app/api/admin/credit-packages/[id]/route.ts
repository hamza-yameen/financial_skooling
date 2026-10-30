import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pkg = await prisma.creditPackage.findUnique({
      where: { id },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Credit package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ package: pkg });
  } catch (error) {
    console.error("Admin get credit package error:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit package" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      tagline,
      description,
      credits,
      bonusCredits,
      price,
      priceGbp,
      badge,
      popular,
      features,
      order,
      published,
    } = body;

    const parsedFeatures = Array.isArray(features)
      ? features.filter((f) => typeof f === "string" && f.trim().length > 0)
      : undefined;

    const updatedPackage = await prisma.creditPackage.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(tagline !== undefined && { tagline: tagline?.trim() || null }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(credits !== undefined && { credits: parseInt(credits, 10) }),
        ...(bonusCredits !== undefined && {
          bonusCredits: parseInt(bonusCredits, 10),
        }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(priceGbp !== undefined && {
          priceGbp: priceGbp ? parseFloat(priceGbp) : null,
        }),
        ...(badge !== undefined && { badge: badge?.trim() || null }),
        ...(popular !== undefined && { popular: Boolean(popular) }),
        ...(parsedFeatures !== undefined && { features: parsedFeatures }),
        ...(order !== undefined && { order: parseInt(order, 10) }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    });

    return NextResponse.json({ success: true, package: updatedPackage });
  } catch (error) {
    console.error("Admin update credit package error:", error);
    return NextResponse.json(
      { error: "Failed to update credit package" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.creditPackage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete credit package error:", error);
    return NextResponse.json(
      { error: "Failed to delete credit package" },
      { status: 500 }
    );
  }
}

