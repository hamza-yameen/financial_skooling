import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: user || { ...session, credits: 0 } });
  } catch (error) {
    console.error("Error fetching live user session:", error);
    return NextResponse.json({ user: { ...session, credits: 0 } });
  }
}
