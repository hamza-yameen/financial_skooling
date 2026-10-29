import React from "react";
import { prisma } from "@/lib/prisma";
import { Activity, CheckCircle2, BookOpen, User, Cpu, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    take: 50,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "COMPLETED_LESSON":
      case "COMPLETED_COURSE":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "ENROLLED":
        return <BookOpen className="w-4 h-4 text-[#5C6E42]" />;
      case "SIMULATION_RUN":
        return <Cpu className="w-4 h-4 text-[#8B9B6D]" />;
      case "REGISTERED":
        return <User className="w-4 h-4 text-amber-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-[#5C6E42] font-semibold">
          SECURITY & TELEMETRY
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2417] tracking-tight mt-1">
          System Audit Stream
        </h1>
        <p className="text-xs text-[#4A5836] mt-0.5">
          Detailed cryptographic audit log of all student and administrative operations.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm divide-y divide-slate-100">
        {activities.map((act) => (
          <div key={act.id} className="p-4 sm:p-5 flex items-start gap-4 text-xs hover:bg-slate-50/50 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{act.title}</span>
                  <span className="text-slate-500 ml-2 font-mono text-[11px]">
                    by {act.user.name} ({act.user.email})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400" suppressHydrationWarning>
                  {new Date(act.createdAt).toLocaleString()}
                </span>
              </div>
              {act.description && (
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {act.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
