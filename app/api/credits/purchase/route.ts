import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, setSession } from "@/lib/auth";
import { CREDIT_PACKAGES } from "@/lib/credits";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packageId, paymentMethod, email, name, password, currency = "EUR" } = body;

    // Look up package from database first, fallback to static if needed
    let pkg: {
      id: string;
      name: string;
      credits: number;
      bonusCredits: number;
      totalCredits: number;
      price: number;
      priceGbp?: number | null;
    } | null = null;

    const dbPkg = await prisma.creditPackage.findUnique({
      where: { id: packageId },
    });

    if (dbPkg) {
      pkg = {
        id: dbPkg.id,
        name: dbPkg.name,
        credits: dbPkg.credits,
        bonusCredits: dbPkg.bonusCredits,
        totalCredits: dbPkg.credits + dbPkg.bonusCredits,
        price: dbPkg.price,
        priceGbp: dbPkg.priceGbp,
      };
    } else {
      const staticPkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
      if (staticPkg) {
        pkg = {
          id: staticPkg.id,
          name: staticPkg.name,
          credits: staticPkg.credits,
          bonusCredits: staticPkg.bonusCredits,
          totalCredits: staticPkg.totalCredits,
          price: staticPkg.price,
          priceGbp: staticPkg.priceGbp,
        };
      }
    }

    if (!pkg) {
      return NextResponse.json(
        { error: "Invalid credit package selected" },
        { status: 400 }
      );
    }

    let user = await getSessionUser();

    // Guest checkout / registration
    if (!user) {
      if (!email) {
        return NextResponse.json(
          { error: "Please sign in or provide your email to purchase credits." },
          { status: 401 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();
      let existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(
          password || "FinSkool@2026!",
          10
        );
        existingUser = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: name?.trim() || normalizedEmail.split("@")[0],
            password: hashedPassword,
            role: "STUDENT",
            credits: 0,
          },
        });
      }

      await setSession(existingUser.id);
      user = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        avatar: existingUser.avatar,
        bio: existingUser.bio,
      };
    }

    // Atomic update of user credits and logging transaction
    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: {
            increment: pkg.totalCredits,
          },
        },
        select: {
          id: true,
          credits: true,
          name: true,
          email: true,
        },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: user.id,
          amount: pkg.totalCredits,
          type: "PURCHASE",
          description: `Purchased ${pkg.name} (+${pkg.totalCredits} Credits)`,
          metadata: JSON.stringify({
            packageId: pkg.id,
            price: currency === "GBP" && pkg.priceGbp ? pkg.priceGbp : pkg.price,
            currency: currency === "GBP" ? "GBP" : "EUR",
            baseCredits: pkg.credits,
            bonusCredits: pkg.bonusCredits,
            paymentMethod: paymentMethod || "MOCK_CARD",
          }),
        },
      }),
      prisma.activity.create({
        data: {
          userId: user.id,
          type: "CREDIT_PURCHASE",
          title: `Added ${pkg.totalCredits} Credits`,
          description: `Acquired ${pkg.name} for ${currency === "GBP" ? "£" : "€"}${
            currency === "GBP" && pkg.priceGbp ? pkg.priceGbp : pkg.price
          }. New wallet balance: active.`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      newBalance: updatedUser.credits,
      addedCredits: pkg.totalCredits,
      packageName: pkg.name,
      transactionId: transaction.id,
      redirectUrl: "/student/credits",
    });
  } catch (error) {
    console.error("Credit purchase error:", error);
    return NextResponse.json(
      { error: "Failed to process credit purchase" },
      { status: 500 }
    );
  }
}

