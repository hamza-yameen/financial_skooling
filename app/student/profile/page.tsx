import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import ProfileForm from "@/components/ProfileForm";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Profile & Settings — Financial Skool",
};

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#5C6E42] font-medium mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Operator Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your account parameters, contact identity, and security keys.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
