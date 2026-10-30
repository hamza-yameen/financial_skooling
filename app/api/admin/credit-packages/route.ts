import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const packages = await prisma.creditPackage.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error("Admin credit packages GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit packages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

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

    if (!name || credits === undefined || price === undefined) {
      return NextResponse.json(
        { error: "Package name, base credits, and EUR price are required" },
        { status: 400 }
      );
    }

    // Clean features list
    const parsedFeatures = Array.isArray(features)
      ? features.filter((f) => typeof f === "string" && f.trim().length > 0)
      : [];

    const newPackage = await prisma.creditPackage.create({
      data: {
        name: name.trim(),
        tagline: tagline?.trim() || null,
        description: description?.trim() || null,
        credits: parseInt(credits, 10),
        bonusCredits: bonusCredits ? parseInt(bonusCredits, 10) : 0,
        price: parseFloat(price),
        priceGbp: priceGbp ? parseFloat(priceGbp) : null,
        badge: badge?.trim() || null,
        popular: Boolean(popular),
        features: parsedFeatures,
        order: order !== undefined ? parseInt(order, 10) : 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ success: true, package: newPackage });
  } catch (error) {
    console.error("Admin create credit package error:", error);
    return NextResponse.json(
      { error: "Failed to create credit package" },
      { status: 500 }
    );
  }
}

