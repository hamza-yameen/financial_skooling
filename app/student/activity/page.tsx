import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Activity, ArrowLeft, CheckCircle2, BookOpen, Cpu } from "lucide-react";

export const metadata = {
  title: "Activity Stream — Financial Skool",
};

export const dynamic = "force-dynamic";

export default async function StudentActivityPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const activities = await prisma.activity.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "COMPLETED_LESSON":
      case "COMPLETED_COURSE":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "ENROLLED":
        return <BookOpen className="w-4 h-4 text-[#5C6E42]" />;
      case "SIMULATION_RUN":
        return <Cpu className="w-4 h-4 text-amber-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "COMPLETED_LESSON":
      case "COMPLETED_COURSE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "ENROLLED":
        return "bg-[#8B9B6D]/15 text-[#384524] border-[#8B9B6D]/30";
      case "SIMULATION_RUN":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-[#EBE2D6]">
        <div>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#5C6E42] font-medium mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Activity Stream & Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Timestamped record of your operational completions and learning progress.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No activity recorded yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Complete lessons and simulations to populate your audit log.</p>
          </div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="p-5 flex items-start gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {getActivityIcon(act.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{act.title}</h3>
                  <span className="text-[11px] font-mono text-slate-400" suppressHydrationWarning>
                    {new Date(act.createdAt).toLocaleString()}
                  </span>
                </div>
                {act.description && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {act.description}
                  </p>
                )}
                <div className="pt-1.5">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${getBadgeColor(act.type)}`}>
                    TAG: {act.type}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
