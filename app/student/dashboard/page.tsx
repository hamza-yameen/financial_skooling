import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  Flame,
} from "lucide-react";

export default async function StudentDashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch enrollments with course details and lessons
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    orderBy: { enrolledAt: "desc" },
    include: {
      course: {
        include: {
          category: true,
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, slug: true, duration: true },
          },
        },
      },
    },
  });

  // Fetch student progress
  const progress = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
  });

  const completedLessonIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.lessonId)
  );

  // Compute stats
  const enrichedCourses = enrollments.map((enr) => {
    const course = enr.course;
    const total = course.lessons.length;
    const completed = course.lessons.filter((l) =>
      completedLessonIds.has(l.id)
    ).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const nextLesson =
      course.lessons.find((l) => !completedLessonIds.has(l.id)) ||
      course.lessons[0];

    return {
      ...course,
      status: enr.status,
      enrolledAt: enr.enrolledAt,
      totalLessons: total,
      completedLessons: completed,
      progressPercentage: percent,
      nextLesson,
    };
  });

  const totalCompletedLessons = progress.filter((p) => p.completed).length;

  // Activities
  const activities = await prisma.activity.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  // Next course to continue
  const activeCourse =
    enrichedCourses.find((c) => c.progressPercentage < 100) ||
    enrichedCourses[0];

  return (
    <div className="space-y-8">
      {/* Header Greeting in Light Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-semibold">
            OPERATOR TERMINAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track your curriculum progression, field manual completions, and systematic simulations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
          >
            Explore More Labs
          </Link>
          <Link
            href="/simulator"
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            Launch Simulator
          </Link>
        </div>
      </div>

      {/* KPI Stats Ribbon in Light Theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Enrolled Programs</span>
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {enrollments.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Perpetual licenses</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Manuals Completed</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
            {totalCompletedLessons}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Verified completions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Streak</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2 font-mono">5 Days</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Consistent study velocity</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EBE2D6] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Student Status</span>
            <div className="p-1.5 rounded-lg bg-[#8B9B6D]/15 text-[#384524]">
              <Award className="w-4 h-4 text-[#5C6E42]" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1C2417] mt-2 font-mono">Verified</p>
          <p className="text-[11px] text-[#5C6E42] font-medium mt-0.5">Full access granted</p>
        </div>
      </div>

      {/* Main Focus: Resume Next Lesson Card */}
      {activeCourse && activeCourse.nextLesson && (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#3D4C2B] via-[#5C6E42] to-[#76885A] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-[#8B9B6D]/30">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#F7F2EB] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BAC8A1]" />
              CONTINUE WHERE YOU LEFT OFF
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {activeCourse.nextLesson.title}
            </h3>
            <p className="text-xs text-[#F7F2EB]/90">
              In program: <strong className="text-white">{activeCourse.title}</strong> •{" "}
              {activeCourse.nextLesson.duration}
            </p>
          </div>

          <Link
            href={`/student/courses/${activeCourse.slug}/learn/${activeCourse.nextLesson.slug}`}
            className="px-6 py-3.5 rounded-xl bg-white text-[#2E3C1B] hover:bg-[#F7F2EB] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
          >
            Resume Learning Manual
            <ArrowRight className="w-4 h-4 text-[#5C6E42]" />
          </Link>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Enrolled Programs & Labs ({enrichedCourses.length})
          </h2>
          <Link
            href="/student/courses"
            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700"
          >
            View All
          </Link>
        </div>

        {enrichedCourses.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Programs Enrolled Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore our PDF-first curriculum to unlock institutional wealth playbooks and risk engines.
            </p>
            <Link
              href="/courses"
              className="inline-flex px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-sm hover:bg-cyan-700 transition-colors"
            >
              Browse Curriculum
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrichedCourses.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={
                        c.coverImage ||
                        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/90 text-slate-800 font-semibold shadow-sm">
                      {c.category.name}
                    </span>
                    <span className="absolute bottom-3 right-3 text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      {c.completedLessons} / {c.totalLessons} Completed
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {c.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-500">
                        <span>Progress</span>
                        <span className="text-[#5C6E42] font-bold">
                          {c.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EBE2D6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#5C6E42] to-[#8B9B6D] rounded-full transition-all duration-500"
                          style={{ width: `${c.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {c.nextLesson ? (
                    <Link
                      href={`/student/courses/${c.slug}/learn/${c.nextLesson.slug}`}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      {c.progressPercentage === 100 ? "Review Material" : "Continue Lesson"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${c.slug}`}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      Open Syllabus
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Log Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Operator Activity</h2>
          <Link
            href="/student/activity"
            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700"
          >
            Full Activity Stream
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm divide-y divide-slate-100">
          {activities.length === 0 ? (
            <p className="p-6 text-xs text-slate-400">No logged activity yet.</p>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="p-4 sm:p-5 flex items-start gap-4 text-xs">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0 mt-0.5 font-mono">
                  ✓
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{act.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {act.description && (
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      {act.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
