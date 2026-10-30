import React from "react";
import { prisma } from "@/lib/prisma";
import AdminCreditPackagesManager from "@/components/AdminCreditPackagesManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Credit Packages Management — Admin Console",
};

export default async function AdminCreditPackagesPage() {
  const packages = await prisma.creditPackage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const serializedPackages = packages.map((pkg) => ({
    ...pkg,
    createdAt: pkg.createdAt.toISOString(),
    updatedAt: pkg.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <AdminCreditPackagesManager initialPackages={serializedPackages} />
    </div>
  );
}

