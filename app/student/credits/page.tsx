import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudentCreditsClient from "./StudentCreditsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Credits & Wallet — Student Terminal",
};

export default async function StudentCreditsPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login?callbackUrl=/student/credits");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      credits: true,
      creditTransactions: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <StudentCreditsClient
      initialCredits={user.credits}
      transactions={user.creditTransactions}
    />
  );
}

