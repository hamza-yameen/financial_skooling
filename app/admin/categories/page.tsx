import React from "react";
import { prisma } from "@/lib/prisma";
import AdminCategoriesManager from "@/components/AdminCategoriesManager";

export const dynamic = "force-dynamic";


export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { courses: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <AdminCategoriesManager initialCategories={categories as any} />
    </div>
  );
}
