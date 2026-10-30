import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, setSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      courseSlug,
      paymentMethod,
      billingDetails,
      // In case user is not logged in:
      email,
      name,
      password,
    } = body;

    let user = await getSessionUser();

    // If guest user checking out, register or find them
    if (!user) {
      if (!email) {
        return NextResponse.json(
          { error: "Please sign in or provide your email to complete enrollment." },
          { status: 401 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();
      let existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password || "FinSkool@2026!", 10);
        existingUser = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: name?.trim() || normalizedEmail.split("@")[0],
            password: hashedPassword,
            role: "STUDENT",
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

    // Look up the course
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          take: 1,
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      const firstLessonSlug = course.lessons[0]?.slug || "";
      return NextResponse.json({
        success: true,
        alreadyEnrolled: true,
        redirectUrl: `/student/courses/${course.slug}/learn/${firstLessonSlug}`,
      });
    }

    // Create enrollment
    const isCreditPayment = paymentMethod === "CREDITS" || paymentMethod === "MOCK_CREDITS";
    const creditCost = course.creditsCost || 25;

    let enrollment;

    if (isCreditPayment) {
      // Check current user credit balance from database
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { credits: true },
      });

      const currentCredits = dbUser?.credits ?? 0;
      if (currentCredits < creditCost) {
        return NextResponse.json(
          {
            error: `Insufficient credits. You need ${creditCost} credits, but your current balance is ${currentCredits} credits.`,
            neededCredits: creditCost - currentCredits,
            currentCredits,
            requiredCredits: creditCost,
          },
          { status: 400 }
        );
      }

      // Execute atomic transaction: deduct credits, record ledger, create enrollment, log activity
      const result = await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: {
            credits: {
              decrement: creditCost,
            },
          },
        }),
        prisma.creditTransaction.create({
          data: {
            userId: user.id,
            amount: -creditCost,
            type: "ENROLLMENT",
            description: `Enrolled in ${course.title} (-${creditCost} Credits)`,
            metadata: JSON.stringify({
              courseId: course.id,
              courseSlug: course.slug,
              creditsSpent: creditCost,
            }),
          },
        }),
        prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            pricePaid: 0,
            creditsSpent: creditCost,
            currency: course.currency,
            paymentMethod: "CREDITS",
            billingDetails: JSON.stringify(billingDetails || { method: "CREDITS" }),
            status: "ACTIVE",
          },
        }),
        prisma.activity.create({
          data: {
            userId: user.id,
            type: "ENROLLED",
            title: `Enrolled in ${course.title} via Credits`,
            description: `Unlocked lifetime curriculum license with ${creditCost} credits.`,
          },
        }),
      ]);

      enrollment = result[2];
    } else {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          pricePaid: course.price,
          currency: course.currency,
          paymentMethod: paymentMethod || "MOCK_CARD",
          billingDetails: JSON.stringify(billingDetails || {}),
          status: "ACTIVE",
        },
      });

      // Record activity
      await prisma.activity.create({
        data: {
          userId: user.id,
          type: "ENROLLED",
          title: `Enrolled in ${course.title}`,
          description: `Successfully completed mock transaction of €${course.price} via ${paymentMethod || "Mock Card"}.`,
        },
      });
    }

    const firstLessonSlug = course.lessons[0]?.slug || "";
    const redirectUrl = firstLessonSlug
      ? `/student/courses/${course.slug}/learn/${firstLessonSlug}`
      : `/student/dashboard`;

    return NextResponse.json({
      success: true,
      enrollmentId: enrollment.id,
      redirectUrl,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
