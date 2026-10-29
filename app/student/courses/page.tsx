import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, CheckCircle2, ArrowRight, Clock, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "My Enrolled Courses — Financial Skool",
};

export const dynamic = "force-dynamic";

export default async function StudentCoursesPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

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

  const progress = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
  });

  const completedLessonIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.lessonId)
  );

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-semibold">
          STUDENT LICENSES
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Enrolled Programs & Labs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Access your perpetual field manuals, financial models, and completion tracking.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Programs Enrolled</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not hold an active program license yet. Explore our curriculum to get started.
          </p>
          <Link
            href="/courses"
            className="inline-flex px-6 py-3 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-sm hover:bg-cyan-700 transition-colors"
          >
            Explore Programs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enr) => {
            const course = enr.course;
            const total = course.lessons.length;
            const completed = course.lessons.filter((l) =>
              completedLessonIds.has(l.id)
            ).length;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            const nextLesson =
              course.lessons.find((l) => !completedLessonIds.has(l.id)) ||
              course.lessons[0];

            return (
              <div
                key={course.id}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={
                        course.coverImage ||
                        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/90 text-slate-800 font-semibold shadow-sm">
                      {course.category.name}
                    </span>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded shadow-sm ${
                        enr.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-cyan-100 text-cyan-800"
                      }`}
                    >
                      {enr.status}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.summary}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-mono text-slate-500">
                        <span>Progress ({completed}/{total})</span>
                        <span className="text-[#5C6E42] font-bold">{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EBE2D6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#5C6E42] to-[#8B9B6D] rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {nextLesson ? (
                    <Link
                      href={`/student/courses/${course.slug}/learn/${nextLesson.slug}`}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      {percent === 100 ? "Review Material" : "Continue Program"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${course.slug}`}
                      className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
