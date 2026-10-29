import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { role } = await request.json(); // "admin" or "student"

    const targetEmail = role === "admin" ? "admin@finskool.com" : "student@finskool.com";

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Demo user not found. Please run database seed." },
        { status: 404 }
      );
    }

    await setSession(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectTo: user.role === "ADMIN" ? "/admin" : "/student/dashboard",
    });
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
