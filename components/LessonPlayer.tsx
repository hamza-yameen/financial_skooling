"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Download,
  ArrowLeft,
  BookOpen,
  Menu,
  X,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface LessonItem {
  id: string;
  title: string;
  slug: string;
  moduleTitle: string;
  order: number;
  duration: string;
  summary: string;
  content: string;
  pdfUrl: string | null;
  isFreePreview: boolean;
}

interface CourseData {
  id: string;
  title: string;
  slug: string;
  lessons: LessonItem[];
}

export default function LessonPlayer({
  course,
  currentLesson,
  initialCompletedLessonIds,
}: {
  course: CourseData;
  currentLesson: LessonItem;
  initialCompletedLessonIds: string[];
}) {
  const router = useRouter();
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(initialCompletedLessonIds)
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const isCurrentCompleted = completedIds.has(currentLesson.id);

  // Find index of current lesson
  const currentIndex = course.lessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < course.lessons.length - 1
      ? course.lessons[currentIndex + 1]
      : null;

  // Calculate overall course progress %
  const progressPercent = Math.round(
    (completedIds.size / (course.lessons.length || 1)) * 100
  );

  const handleToggleComplete = async (targetLessonId: string, markState?: boolean) => {
    const newState =
      markState !== undefined ? markState : !completedIds.has(targetLessonId);

    setUpdatingProgress(true);
    const toastId = toast.loading(newState ? "Marking lesson as complete..." : "Updating progress...");

    try {
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: targetLessonId,
          completed: newState,
        }),
      });

      if (res.ok) {
        setCompletedIds((prev) => {
          const next = new Set(prev);
          if (newState) {
            next.add(targetLessonId);
          } else {
            next.delete(targetLessonId);
          }
          return next;
        });
        toast.success(
          newState ? "Lesson marked as complete!" : "Lesson marked as incomplete.",
          { id: toastId }
        );
      } else {
        toast.error("Failed to update lesson progress", { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to communicate with server", { id: toastId });
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleCompleteAndNext = async () => {
    if (!isCurrentCompleted) {
      await handleToggleComplete(currentLesson.id, true);
    }

    if (nextLesson) {
      router.push(`/student/courses/${course.slug}/learn/${nextLesson.slug}`);
    } else {
      toast.success("Congratulations! You completed all modules in this program!");
      router.push("/student/dashboard");
    }
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    const toastId = toast.loading("Preparing field manual download...");

    setTimeout(() => {
      try {
        if (currentLesson.pdfUrl) {
          // Direct download link from server (e.g. /api/lessons/download/<file>)
          const link = document.createElement("a");
          link.href = currentLesson.pdfUrl;
          link.download = currentLesson.pdfUrl.split("/").pop() || `${currentLesson.slug}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Fallback markdown file download
          const blob = new Blob([currentLesson.content], { type: "text/markdown" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${currentLesson.slug}-field-manual.md`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        toast.success("Field manual download started!", { id: toastId });
      } catch (err) {
        toast.error("Download failed. Please try again.", { id: toastId });
      } finally {
        setDownloading(false);
      }
    }, 400);
  };

  // Group lessons by module
  const moduleGroups = new Map<string, LessonItem[]>();
  course.lessons.forEach((l) => {
    const mod = l.moduleTitle || "General Modules";
    if (!moduleGroups.has(mod)) {
      moduleGroups.set(mod, []);
    }
    moduleGroups.get(mod)!.push(l);
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row relative bg-slate-50">
      {/* Mobile Sidebar Toggle Header */}
      <div className="lg:hidden p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-indigo-600 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          Curriculum Menu ({completedIds.size}/{course.lessons.length})
        </button>
        <span className="text-xs font-mono font-bold text-slate-700">{progressPercent}%</span>
      </div>

      {/* Left Collapsible Curriculum Sidebar */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 w-80 lg:w-88 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 shadow-sm lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-200 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <Link
              href="/student/courses"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              My Programs
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-sm font-bold text-[#1C2417] line-clamp-1">{course.title}</h2>
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mt-2">
              <span>Overall Progress</span>
              <span className="text-[#5C6E42] font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#EBE2D6] rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-[#5C6E42] to-[#8B9B6D] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lessons List Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {Array.from(moduleGroups.entries()).map(([moduleName, moduleLessons], mIdx) => (
            <div key={mIdx} className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4A5836] font-bold px-2 block">
                {moduleName}
              </span>

              <div className="space-y-1">
                {moduleLessons.map((l) => {
                  const isCurrent = l.id === currentLesson.id;
                  const isDone = completedIds.has(l.id);

                  return (
                    <Link
                      key={l.id}
                      href={`/student/courses/${course.slug}/learn/${l.slug}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-start gap-3 p-3 rounded-xl text-xs transition-all ${
                        isCurrent
                          ? "bg-[#8B9B6D]/15 border border-[#8B9B6D]/30 text-[#1C2417] font-medium shadow-xs"
                          : "hover:bg-[#F7F2EB] text-slate-700 border border-transparent"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleComplete(l.id);
                        }}
                        className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`line-clamp-2 leading-snug ${
                            isCurrent ? "font-bold text-[#1C2417]" : "font-medium text-slate-800"
                          }`}
                        >
                          {l.title}
                        </p>
                        <span className="text-[10px] font-mono text-[#8B9B6D] block mt-0.5">
                          {l.duration}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#EBE2D6] bg-[#F7F2EB]/50 text-center">
          <Link
            href="/simulator"
            className="text-xs font-semibold text-[#5C6E42] hover:text-[#384524] inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B9B6D]" />
            Launch Interactive Risk Simulator
          </Link>
        </div>
      </aside>

      {/* Main Lesson Reader Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* Top Operational Bar */}
          <div className="p-6 rounded-2xl bg-white border border-[#EBE2D6] shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[#5C6E42] uppercase tracking-wider font-bold">
                  {currentLesson.moduleTitle}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2417] tracking-tight">
                  {currentLesson.title}
                </h1>
                <span className="text-xs text-[#4A5836] font-mono block">
                  {currentLesson.duration} • Operational Architecture Manual
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="px-4 py-2.5 rounded-xl bg-[#F7F2EB] hover:bg-[#EBE2D6] text-xs font-semibold text-[#1C2417] border border-[#EBE2D6] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {downloading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5C6E42]" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-[#5C6E42]" />
                  )}
                  {downloading ? "Preparing Manual..." : "Download Field Manual"}
                </button>

                <button
                  onClick={() => handleToggleComplete(currentLesson.id)}
                  disabled={updatingProgress}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                    isCurrentCompleted
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                      : "bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] text-white shadow-xs"
                  }`}
                >
                  {updatingProgress ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {isCurrentCompleted ? "Completed" : "Mark Complete"}
                </button>
              </div>
            </div>
          </div>

          {/* Reading Document Surface */}
          <article className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
              {currentLesson.content.split("\n\n").map((paragraph, pIdx) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h2 key={pIdx} className="text-2xl font-bold text-slate-900 tracking-tight pt-4 border-b border-slate-100 pb-2">
                      {paragraph.replace("# ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h3 key={pIdx} className="text-lg font-bold text-indigo-950 tracking-tight pt-3">
                      {paragraph.replace("## ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h4 key={pIdx} className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2 font-mono">
                      {paragraph.replace("### ", "")}
                    </h4>
                  );
                }
                if (paragraph.startsWith("```")) {
                  const cleanedCode = paragraph.replace(/```[a-z]*\n?/g, "").trim();
                  return (
                    <pre
                      key={pIdx}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto shadow-inner"
                    >
                      <code>{cleanedCode}</code>
                    </pre>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  const items = paragraph.split("\n").map((line) => line.replace("- ", ""));
                  return (
                    <ul key={pIdx} className="space-y-2 text-xs text-slate-700 pl-2">
                      {items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={pIdx} className="text-slate-700 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </article>

          {/* Bottom Lesson Navigation */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            {prevLesson ? (
              <Link
                href={`/student/courses/${course.slug}/learn/${prevLesson.slug}`}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors flex items-center gap-2 shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous: {prevLesson.title}
              </Link>
            ) : (
              <div />
            )}

            <button
              onClick={handleCompleteAndNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 hover:scale-[1.01] transition-all flex items-center gap-2 cursor-pointer"
            >
              {nextLesson ? (
                <>
                  Mark Complete & Next Lesson
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Complete Program & Return to Dashboard
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
