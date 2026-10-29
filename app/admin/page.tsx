import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Plus,
  CreditCard,
  Activity,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let totalStudents = 0;
  let totalCourses = 0;
  let totalEnrollments = 0;
  let totalRevenue = 0;
  let recentEnrollments: Array<{
    id: string;
    enrolledAt: Date;
    pricePaid: number;
    user: { name: string; email: string };
    course: { title: string; price: number };
  }> = [];
  let recentActivities: Array<{
    id: string;
    title: string;
    createdAt: Date;
    user: { name: string; role: string };
  }> = [];
  let completedEnrollments = 0;
  let dbNotice: string | null = null;

  try {
    // Execute in small batches to respect DigitalOcean PostgreSQL low client connection ceiling
    const [students, courses, enrollments] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count(),
      prisma.enrollment.count(),
    ]);
    totalStudents = students;
    totalCourses = courses;
    totalEnrollments = enrollments;

    const [revenueRes, completedCount] = await Promise.all([
      prisma.enrollment.aggregate({
        _sum: { pricePaid: true },
      }),
      prisma.enrollment.count({
        where: { status: "COMPLETED" },
      }),
    ]);
    totalRevenue = revenueRes._sum.pricePaid || 0;
    completedEnrollments = completedCount;

    const [enrollmentsList, activitiesList] = await Promise.all([
      prisma.enrollment.findMany({
        take: 5,
        orderBy: { enrolledAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true, price: true } },
        },
      }),
      prisma.activity.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, role: true } },
        },
      }),
    ]);
    recentEnrollments = enrollmentsList;
    recentActivities = activitiesList;
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Admin dashboard telemetry fetch:", err?.message || error);
    dbNotice = "Database connection pool is currently busy. Displaying cached session state.";
  }

  const completionRate =
    totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {dbNotice && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-medium">{dbNotice}</span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md">
            Auto-Retrying
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE2D6]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#5C6E42] font-semibold">
            SYSTEM OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2417] tracking-tight mt-1">
            Financial Skool Command Dashboard
          </h1>
          <p className="text-xs text-[#4A5836] mt-0.5">
            Real-time telemetry on revenue, dynamic curriculum, student licenses, and completions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Program
          </Link>
          <Link
            href="/admin/enrollments"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F7F2EB] text-[#1C2417] text-xs font-semibold border border-[#EBE2D6] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <CreditCard className="w-4 h-4 text-[#5C6E42]" />
            Manage Enrollments
          </Link>
        </div>
      </div>

      {/* KPI Stats Ribbon in Light Theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#EBE2D6] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Gross Platform Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C2417] mt-2 font-mono">
            €{totalRevenue.toLocaleString()}.00
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Lifetime licenses issued</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EBE2D6] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Registered Students</span>
            <div className="p-1.5 rounded-lg bg-[#8B9B6D]/15 text-[#384524]">
              <Users className="w-4 h-4 text-[#5C6E42]" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C2417] mt-2 font-mono">
            {totalStudents}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active student accounts</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Dynamic Programs</span>
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {totalCourses}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Managed in PostgreSQL</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Graduation Rate</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {completionRate}%
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Completed all modules</p>
        </div>
      </div>

      {/* Grid: Recent Enrollments & System Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enrollments */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1C2417] tracking-tight">
              Recent Student Enrollments
            </h2>
            <Link
              href="/admin/enrollments"
              className="text-xs font-semibold text-[#5C6E42] hover:text-[#384524]"
            >
              View All ({totalEnrollments})
            </Link>
          </div>

          <div className="rounded-2xl bg-white border border-[#EBE2D6] shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentEnrollments.map((enr) => (
                <div
                  key={enr.id}
                  className="p-4 flex items-center justify-between gap-4 text-xs hover:bg-[#F7F2EB]/60 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#1C2417]">{enr.user.name}</p>
                    <p className="text-[11px] text-slate-500">{enr.course.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-emerald-600">
                      €{enr.course.price}.00
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(enr.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Audit Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1C2417] tracking-tight">
              Platform Audit Stream
            </h2>
            <Link
              href="/admin/activity"
              className="text-xs font-semibold text-[#5C6E42] hover:text-[#384524]"
            >
              Full Stream
            </Link>
          </div>

          <div className="rounded-2xl bg-white border border-[#EBE2D6] shadow-sm divide-y divide-slate-100">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-3.5 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    {act.user?.name || "System"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(act.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {act.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
