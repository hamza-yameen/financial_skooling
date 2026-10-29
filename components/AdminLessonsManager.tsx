"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  ArrowLeft,
  Save,
  X,
  CheckCircle2,
  Lock,
  Unlock,
  Upload,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface LessonItem {
  id: string;
  courseId: string;
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

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  lessons: LessonItem[];
}

export default function AdminLessonsManager({
  course,
}: {
  course: CourseItem;
}) {
  const [lessons, setLessons] = useState<LessonItem[]>(course.lessons);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [moduleTitle, setModuleTitle] = useState("Module 1");
  const [order, setOrder] = useState("1");
  const [duration, setDuration] = useState("25 min read • 14 Pages Manual");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isFreePreview, setIsFreePreview] = useState(false);

  // PDF Upload states
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadedPdfInfo, setUploadedPdfInfo] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingLesson(null);
    setTitle("");
    setSlug("");
    setModuleTitle(`Module ${lessons.length + 1}`);
    setOrder(String(lessons.length + 1));
    setDuration("25 min read • 14 Pages Manual");
    setSummary("");
    setContent(`# New Field Manual\n\n## 1. Operating Thesis\nWrite your dense operational guide here...`);
    setPdfUrl("");
    setUploadedPdfInfo(null);
    setIsFreePreview(false);
    setError(null);
  };

  const openEditModal = (lesson: LessonItem) => {
    setEditingLesson(lesson);
    setIsCreating(false);
    setTitle(lesson.title);
    setSlug(lesson.slug);
    setModuleTitle(lesson.moduleTitle);
    setOrder(String(lesson.order));
    setDuration(lesson.duration);
    setSummary(lesson.summary);
    setContent(lesson.content);
    setPdfUrl(lesson.pdfUrl || "");
    setUploadedPdfInfo(lesson.pdfUrl ? `Linked: ${lesson.pdfUrl}` : null);
    setIsFreePreview(lesson.isFreePreview);
    setError(null);
  };

  const closeModal = () => {
    setEditingLesson(null);
    setIsCreating(false);
    setError(null);
    setUploadedPdfInfo(null);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isCreating) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  // PDF Upload Handler
  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a valid PDF document (.pdf)");
      return;
    }

    setUploadingPdf(true);
    const toastId = toast.loading(`Uploading "${file.name}" to root /lessons directory...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload PDF");
      }

      setPdfUrl(data.downloadUrl);
      setUploadedPdfInfo(`Saved to root /lessons as: ${data.fileName} (${Math.round(data.fileSize / 1024)} KB)`);
      toast.success("PDF saved inside root /lessons directory successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "PDF upload failed", { id: toastId });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const toastId = toast.loading(isCreating ? "Creating technical manual..." : "Updating manual...");

    const payload = {
      title,
      slug,
      moduleTitle,
      order: parseInt(order, 10) || 0,
      duration,
      summary,
      content,
      pdfUrl: pdfUrl || null,
      isFreePreview,
    };

    try {
      if (isCreating) {
        const res = await fetch(`/api/admin/courses/${course.id}/lessons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create lesson");
        setLessons((prev) => [...prev, data.lesson].sort((a, b) => a.order - b.order));
        toast.success(`Lesson "${data.lesson.title}" published!`, { id: toastId });
      } else if (editingLesson) {
        const res = await fetch(`/api/admin/lessons/${editingLesson.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update lesson");
        setLessons((prev) =>
          prev
            .map((l) => (l.id === editingLesson.id ? data.lesson : l))
            .sort((a, b) => a.order - b.order)
        );
        toast.success(`Lesson "${data.lesson.title}" updated!`, { id: toastId });
      }
      closeModal();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "Failed to save lesson", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string, lessonTitle: string) => {
    if (!confirm(`Are you sure you want to delete lesson "${lessonTitle}"?`)) return;

    const toastId = toast.loading(`Deleting "${lessonTitle}"...`);
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLessons((prev) => prev.filter((l) => l.id !== lessonId));
        toast.success(`Deleted "${lessonTitle}"`, { id: toastId });
      } else {
        toast.error("Failed to delete lesson", { id: toastId });
      }
    } catch (err) {
      toast.error("Error deleting lesson", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/admin/courses"
            className="text-xs font-mono text-slate-500 hover:text-[#5C6E42] flex items-center gap-1.5 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Programs
          </Link>
          <h2 className="text-2xl font-bold text-[#1C2417]">
            Curriculum Lessons: <span className="text-[#5C6E42]">{course.title}</span>
          </h2>
          <p className="text-xs text-[#4A5836] mt-0.5">
            {lessons.length} Modules & Architectural Manuals (Root /lessons storage enabled)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Technical Manual / Lesson
        </button>
      </div>

      {/* Lessons Table in Light Theme */}
      <div className="rounded-2xl bg-white border border-[#EBE2D6] shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-[#F7F2EB] border-b border-[#EBE2D6] text-slate-500 uppercase font-mono text-[10px]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Order</th>
              <th className="py-3.5 px-4 font-semibold">Module & Lesson Title</th>
              <th className="py-3.5 px-4 font-semibold">Slug</th>
              <th className="py-3.5 px-4 font-semibold">Duration</th>
              <th className="py-3.5 px-4 font-semibold">PDF File</th>
              <th className="py-3.5 px-4 font-semibold">Preview Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lessons.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No lessons created yet. Click &quot;Add Technical Manual&quot; to begin.
                </td>
              </tr>
            ) : (
              lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-[#F7F2EB]/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-[#5C6E42]">
                    #{lesson.order}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {lesson.moduleTitle}
                    </span>
                    <span className="font-bold text-slate-900 block mt-0.5">{lesson.title}</span>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-500">
                    {lesson.slug}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-700">
                    {lesson.duration}
                  </td>
                  <td className="py-4 px-4">
                    {lesson.pdfUrl ? (
                      <a
                        href={lesson.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        <FileCheck className="w-3 h-3 text-emerald-600" />
                        PDF Linked
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[10px] font-mono">No PDF</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {lesson.isFreePreview ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold flex items-center gap-1 w-fit">
                        <Unlock className="w-3 h-3" /> Free Preview
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-mono flex items-center gap-1 w-fit">
                        <Lock className="w-3 h-3" /> Enrolled Only
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(lesson)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                        title="Edit Lesson"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id, lesson.title)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                        title="Delete Lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal in Light Theme */}
      {(isCreating || editingLesson) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {isCreating ? "Add Technical Manual / Lesson" : `Edit: ${editingLesson?.title}`}
              </h3>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Foundations of Wealth & Credit Architecture"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. foundations-wealth-credit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-indigo-700 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Module Group
                  </label>
                  <input
                    type="text"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    placeholder="e.g. Module 1: Financial Architecture"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lesson Order #
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration Spec
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 25 min read • 14 Pages"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
                  />
                </div>
              </div>

              {/* PDF UPLOAD BOX TO ROOT /lessons DIRECTORY */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    PDF Field Manual Upload (Saves to root /lessons directory)
                  </label>
                  <span className="text-[10px] font-mono text-[#5C6E42] font-semibold">
                    Direct Root Storage
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B9B6D]/15 border border-[#8B9B6D]/30 hover:bg-[#8B9B6D]/25 text-[#384524] text-xs font-semibold cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4 text-[#5C6E42]" />
                    <span>{uploadingPdf ? "Uploading..." : "Select PDF Document"}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      disabled={uploadingPdf}
                      onChange={handlePdfFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="or enter custom PDF URL /api/lessons/download/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-700 focus:border-[#5C6E42] focus:outline-none"
                  />
                </div>

                {uploadedPdfInfo && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{uploadedPdfInfo}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Executive Summary / Overview
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short description of this lesson..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Manual Content (Markdown Supported)
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dense technical markdown manual content..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={isFreePreview}
                    onChange={(e) => setIsFreePreview(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#5C6E42] focus:ring-[#8B9B6D]"
                  />
                  <span className="font-medium">Allow Free Public Preview (No Enrollment Needed)</span>
                </label>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploadingPdf}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {loading ? "Saving..." : "Save Technical Manual"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
