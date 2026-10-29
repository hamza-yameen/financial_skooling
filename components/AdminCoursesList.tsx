"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Edit,
  Trash2,
  BookOpen,
  Plus,
  Eye,
  EyeOff,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface AdminCourseItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  level: string;
  published: boolean;
  order: number;
  category: { name: string };
  _count: { lessons: number; enrollments: number };
}

export default function AdminCoursesList({
  initialCourses,
}: {
  initialCourses: AdminCourseItem[];
}) {
  const [courses, setCourses] = useState(initialCourses);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const togglePublish = async (courseId: string, currentStatus: boolean, title: string) => {
    setLoadingId(courseId);
    const toastId = toast.loading(`${currentStatus ? "Unpublishing" : "Publishing"} "${title}"...`);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (res.ok) {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, published: !currentStatus } : c))
        );
        toast.success(`"${title}" is now ${!currentStatus ? "Published" : "Draft"}!`, { id: toastId });
      } else {
        toast.error("Failed to update status", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error while updating status", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${courseTitle}"?`)) {
      return;
    }

    setLoadingId(courseId);
    const toastId = toast.loading(`Deleting "${courseTitle}"...`);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
        toast.success(`Deleted "${courseTitle}" successfully`, { id: toastId });
      } else {
        toast.error("Failed to delete course", { id: toastId });
      }
    } catch (err) {
      toast.error("Error deleting course", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Order</th>
                <th className="py-3.5 px-4 font-semibold">Title & Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Level</th>
                <th className="py-3.5 px-4 font-semibold">Lessons</th>
                <th className="py-3.5 px-4 font-semibold">Students</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-[#5C6E42]">
                    #{course.order}
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <span className="font-bold text-slate-900 block truncate">{course.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {course.category.name}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-600">
                    €{course.price}.00
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-medium text-slate-700">
                      {course.level}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-800">
                    {course._count.lessons}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-800">
                    {course._count.enrollments}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => togglePublish(course.id, course.published, course.title)}
                      disabled={loadingId === course.id}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                        course.published
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {course.published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/courses/${course.id}/lessons`}
                        className="px-2.5 py-1.5 rounded-lg bg-[#8B9B6D]/15 text-[#384524] hover:bg-[#8B9B6D]/25 border border-[#8B9B6D]/30 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <BookOpen className="w-3 h-3" />
                        Lessons ({course._count.lessons})
                      </Link>
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        disabled={loadingId === course.id}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
