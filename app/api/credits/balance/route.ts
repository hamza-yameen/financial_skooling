import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ authenticated: false, credits: 0, transactions: [] });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        credits: true,
        creditTransactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, credits: 0, transactions: [] });
    }

    return NextResponse.json({
      authenticated: true,
      credits: user.credits,
      transactions: user.creditTransactions,
    });
  } catch (error) {
    console.error("Error fetching credit balance:", error);
    return NextResponse.json(
      { error: "Failed to retrieve credit balance" },
      { status: 500 }
    );
  }
}

