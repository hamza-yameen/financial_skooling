import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import CheckoutForm from "@/components/CheckoutForm";
import CheckoutSummary from "@/components/CheckoutSummary";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  return {
    title: `Instant Checkout — Financial Skool`,
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;

  const [course, sessionUser] = await Promise.all([
    prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        lessons: {
          select: { slug: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    getSessionUser(),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background ambient bloom */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[450px] bg-[#8B9B6D]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono font-semibold text-[#4A5836] mb-8">
          <Link href="/" className="hover:text-[#5C6E42] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8B9B6D]" />
          <Link href="/courses" className="hover:text-[#5C6E42] transition-colors">
            Programs
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8B9B6D]" />
          <Link href={`/courses/${course.slug}`} className="hover:text-[#5C6E42] transition-colors truncate max-w-xs">
            {course.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8B9B6D]" />
          <span className="text-[#384524] font-bold">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Payment Details */}
          <div className="lg:col-span-7">
            <div className="mb-6 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C2417] tracking-tight">
                Instant Program Licensing
              </h1>
              <p className="text-xs sm:text-sm text-[#4A5836] font-medium">
                Provide mock banking or card credentials to unlock permanent dashboard access.
              </p>
            </div>

            <CheckoutForm course={course as any} user={sessionUser} />
          </div>

          {/* Right Summary: Order Details */}
          <div className="lg:col-span-5">
            <CheckoutSummary course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
