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
      {/* Header Greeting in Increase Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D5DEE5]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#007554] font-semibold">
            OPERATOR TERMINAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D2A36] tracking-tight mt-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#657482] mt-0.5">
            Track your curriculum progression, field manual completions, and systematic simulations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-semibold text-[#1D2A36] shadow-xs transition-colors"
          >
            Explore More Labs
          </Link>
          <Link
            href="/simulator"
            className="px-4 py-2.5 rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 border border-[#132030]"
          >
            <Cpu className="w-3.5 h-3.5 text-[#31F2BF]" />
            Launch Simulator
          </Link>
        </div>
      </div>

      {/* KPI Stats Ribbon in Increase Theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#D5DEE5] shadow-xs">
          <div className="flex items-center justify-between text-[#657482] text-xs font-medium">
            <span>Enrolled Programs</span>
            <div className="p-1.5 rounded-lg bg-[#F5F8FA] text-[#1D2A36]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1D2A36] mt-2 font-mono">
            {enrollments.length}
          </p>
          <p className="text-[11px] text-[#8995A1] mt-0.5">Perpetual licenses</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D5DEE5] shadow-xs">
          <div className="flex items-center justify-between text-[#657482] text-xs font-medium">
            <span>Manuals Completed</span>
            <div className="p-1.5 rounded-lg bg-[#E3FFF3] text-[#007554]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#007554] mt-2 font-mono">
            {totalCompletedLessons}
          </p>
          <p className="text-[11px] text-[#8995A1] mt-0.5">Verified completions</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D5DEE5] shadow-xs">
          <div className="flex items-center justify-between text-[#657482] text-xs font-medium">
            <span>Active Streak</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2 font-mono">5 Days</p>
          <p className="text-[11px] text-[#8995A1] mt-0.5">Consistent study velocity</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D5DEE5] shadow-xs">
          <div className="flex items-center justify-between text-[#657482] text-xs font-medium">
            <span>Student Status</span>
            <div className="p-1.5 rounded-lg bg-[#E3FFF3] text-[#007554]">
              <Award className="w-4 h-4 text-[#007554]" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1D2A36] mt-2 font-mono">Verified</p>
          <p className="text-[11px] text-[#007554] font-medium mt-0.5">Full access granted</p>
        </div>
      </div>

      {/* Main Focus: Resume Next Lesson Card */}
      {activeCourse && activeCourse.nextLesson && (
        <div className="p-6 sm:p-8 rounded-xl bg-[#132030] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg border border-[#314352]">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#31F2BF] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#31F2BF]" />
              CONTINUE WHERE YOU LEFT OFF
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {activeCourse.nextLesson.title}
            </h3>
            <p className="text-xs text-[#8995A1]">
              In program: <strong className="text-white">{activeCourse.title}</strong> •{" "}
              {activeCourse.nextLesson.duration}
            </p>
          </div>

          <Link
            href={`/student/courses/${activeCourse.slug}/learn/${activeCourse.nextLesson.slug}`}
            className="px-6 py-3.5 rounded-lg bg-white text-[#1D2A36] hover:bg-[#F5F8FA] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 border border-transparent"
          >
            Resume Learning Manual
            <ArrowRight className="w-4 h-4 text-[#007554]" />
          </Link>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1D2A36] tracking-tight">
            Enrolled Programs & Labs ({enrichedCourses.length})
          </h2>
          <Link
            href="/student/courses"
            className="text-xs font-semibold text-[#007554] hover:underline"
          >
            View All
          </Link>
        </div>

        {enrichedCourses.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-4">
            <BookOpen className="w-8 h-8 text-[#8995A1] mx-auto" />
            <h3 className="text-base font-bold text-[#1D2A36]">No Programs Enrolled Yet</h3>
            <p className="text-xs text-[#657482] max-w-sm mx-auto">
              Explore our PDF-first curriculum to unlock institutional wealth playbooks and risk engines.
            </p>
            <Link
              href="/courses"
              className="inline-flex px-5 py-2.5 rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-white font-bold text-xs shadow-xs transition-colors border border-[#132030]"
            >
              Browse Curriculum
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrichedCourses.map((c) => (
              <div
                key={c.id}
                className="rounded-xl bg-white border border-[#D5DEE5] shadow-xs hover:border-[#8995A1] transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-[#EDF1F5]">
                    <img
                      src={
                        c.coverImage ||
                        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1726]/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/95 text-[#1D2A36] font-semibold shadow-xs">
                      {c.category.name}
                    </span>
                    <span className="absolute bottom-3 right-3 text-[10px] font-mono text-white bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {c.completedLessons} / {c.totalLessons} Completed
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-[#1D2A36] line-clamp-2">
                      {c.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-[#657482]">
                        <span>Progress</span>
                        <span className="text-[#007554] font-bold">
                          {c.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EDF1F5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#007554] to-[#31F2BF] rounded-full transition-all duration-500"
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
                      className="w-full py-2.5 rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-xs border border-[#132030]"
                    >
                      {c.progressPercentage === 100 ? "Review Material" : "Continue Lesson"}
                      <ArrowRight className="w-3.5 h-3.5 text-[#31F2BF]" />
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${c.slug}`}
                      className="w-full py-2.5 rounded-lg bg-[#F5F8FA] hover:bg-white text-xs font-semibold text-[#1D2A36] flex items-center justify-center gap-1.5 transition-colors border border-[#D5DEE5]"
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
          <h2 className="text-lg font-bold text-[#1D2A36] tracking-tight">Recent Operator Activity</h2>
          <Link
            href="/student/activity"
            className="text-xs font-semibold text-[#007554] hover:underline"
          >
            Full Activity Stream
          </Link>
        </div>

        <div className="rounded-xl bg-white border border-[#D5DEE5] shadow-xs divide-y divide-[#EDF1F5]">
          {activities.length === 0 ? (
            <p className="p-6 text-xs text-[#8995A1]">No logged activity yet.</p>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="p-4 sm:p-5 flex items-start gap-4 text-xs">
                <div className="w-8 h-8 rounded-lg bg-[#E3FFF3] border border-[#31F2BF]/30 flex items-center justify-center text-[#007554] shrink-0 mt-0.5 font-mono">
                  ✓
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1D2A36]">{act.title}</span>
                    <span className="text-[10px] font-mono text-[#8995A1]">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {act.description && (
                    <p className="text-[#657482] text-[11px] leading-relaxed">
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
