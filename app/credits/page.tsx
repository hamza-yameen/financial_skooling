import React from "react";
import { prisma } from "@/lib/prisma";
import { CREDIT_PACKAGES } from "@/lib/credits";
import CreditsClientView, { DynamicCreditPackage } from "@/components/CreditsClientView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Course Credits & Bulk Packages — Financial Skool",
  description:
    "Acquire non-expiring course credits with up to 35% bundle savings. Unlock any PDF-first playbook, risk model, or quantitative lab instantaneously.",
};

export default async function CreditsPage() {
  // Query dynamic packages from PostgreSQL database
  let packages: DynamicCreditPackage[] = [];

  try {
    const dbPackages = await prisma.creditPackage.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { price: "asc" }],
    });

    if (dbPackages.length > 0) {
      packages = dbPackages.map((p) => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        credits: p.credits,
        bonusCredits: p.bonusCredits,
        price: p.price,
        priceGbp: p.priceGbp,
        currency: p.currency,
        badge: p.badge,
        popular: p.popular,
        features: p.features || [],
        order: p.order,
      }));
    }
  } catch (err) {
    console.error("Failed to query DB credit packages, using fallback:", err);
  }

  // Fallback to static packages if DB query returned none
  if (packages.length === 0) {
    packages = CREDIT_PACKAGES.map((p, idx) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      credits: p.credits,
      bonusCredits: p.bonusCredits,
      price: p.price,
      priceGbp: p.priceGbp,
      currency: "EUR",
      badge: p.badge || null,
      popular: p.popular || false,
      features: p.features,
      order: idx + 1,
    }));
  }

  return <CreditsClientView packages={packages} />;
}
