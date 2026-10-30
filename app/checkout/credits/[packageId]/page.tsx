import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { CREDIT_PACKAGES } from "@/lib/credits";
import CreditCheckoutForm from "@/components/CreditCheckoutForm";
import CreditCheckoutSummary from "@/components/CreditCheckoutSummary";
import { ChevronRight, Coins } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ packageId: string }>;
}) {
  const { packageId } = await params;
  const pkg = await prisma.creditPackage.findUnique({
    where: { id: packageId },
    select: { name: true },
  });

  return {
    title: `${pkg?.name || "Credit Package"} Checkout — Financial Skool`,
    description: "Purchase non-expiring study credits to unlock institutional playbooks and quant engines.",
  };
}

export default async function CreditCheckoutPage({
  params,
}: {
  params: Promise<{ packageId: string }>;
}) {
  const { packageId } = await params;

  // Find in DB first, fallback to static if needed
  let pkg = await prisma.creditPackage.findUnique({
    where: { id: packageId },
  });

  if (!pkg) {
    const staticPkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
    if (staticPkg) {
      pkg = {
        id: staticPkg.id,
        name: staticPkg.name,
        tagline: staticPkg.tagline,
        description: staticPkg.description,
        credits: staticPkg.credits,
        bonusCredits: staticPkg.bonusCredits,
        price: staticPkg.price,
        priceGbp: staticPkg.priceGbp,
        currency: "EUR",
        badge: staticPkg.badge || null,
        popular: staticPkg.popular || false,
        features: staticPkg.features,
        order: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  if (!pkg) {
    notFound();
  }

  const sessionUser = await getSessionUser();

  const formattedPkg = {
    id: pkg.id,
    name: pkg.name,
    tagline: pkg.tagline,
    description: pkg.description,
    credits: pkg.credits,
    bonusCredits: pkg.bonusCredits,
    price: pkg.price,
    priceGbp: pkg.priceGbp,
    currency: pkg.currency,
    badge: pkg.badge,
    popular: pkg.popular,
    features: pkg.features || [],
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#EDF1F5]">
      {/* Background ambient blooms */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[450px] bg-[#31F2BF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-[#34BCFF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono font-semibold text-[#657482] mb-8">
          <Link href="/" className="hover:text-[#007554] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8995A1]" />
          <Link href="/credits" className="hover:text-[#007554] transition-colors">
            Credits
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8995A1]" />
          <span className="text-[#1D2A36] font-bold truncate max-w-xs">
            {pkg.name} Checkout
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Payment Details */}
          <div className="lg:col-span-7">
            <div className="mb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/40 text-xs font-mono font-bold uppercase tracking-wider">
                <Coins className="w-3.5 h-3.5" />
                INSTANT CREDITS ALLOCATION
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1D2A36] tracking-tight">
                Complete {pkg.name} Purchase
              </h1>
              <p className="text-xs sm:text-sm text-[#657482]">
                Provide your mock card or wire details to immediately provision +{pkg.credits + pkg.bonusCredits} credits into your student account.
              </p>
            </div>

            <CreditCheckoutForm pkg={formattedPkg} user={sessionUser} />
          </div>

          {/* Right Summary: Package Details */}
          <div className="lg:col-span-5">
            <CreditCheckoutSummary pkg={formattedPkg} />
          </div>
        </div>
      </div>
    </div>
  );
}

