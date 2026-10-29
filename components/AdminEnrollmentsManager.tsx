"use client";

import React, { useState } from "react";
import { CreditCard, Plus, Trash2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface EnrollmentItem {
  id: string;
  pricePaid: number;
  paymentMethod: string;
  status: string;
  enrolledAt: string;
  user: { id: string; name: string; email: string };
  course: { id: string; title: string; price: number };
}

interface StudentOption {
  id: string;
  name: string;
  email: string;
}

interface CourseOption {
  id: string;
  title: string;
  price: number;
}

export default function AdminEnrollmentsManager({
  initialEnrollments,
  students,
  courses,
}: {
  initialEnrollments: EnrollmentItem[];
  students: StudentOption[];
  courses: CourseOption[];
}) {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>(initialEnrollments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(students[0]?.id || "");
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Granting program license...");

    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          courseId: selectedCourseId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to grant enrollment");

      setEnrollments((prev) => [data.enrollment, ...prev]);
      toast.success("Lifetime program license successfully granted!", { id: toastId });
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to grant enrollment");
      toast.error(err.message || "Failed to grant license", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (enrollmentId: string, studentName: string, courseTitle: string) => {
    if (!confirm(`Revoke license for "${studentName}" in "${courseTitle}"?`)) return;

    const toastId = toast.loading(`Revoking license for "${studentName}"...`);
    try {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
        toast.success(`License revoked for ${studentName}`, { id: toastId });
      } else {
        toast.error("Failed to revoke enrollment", { id: toastId });
      }
    } catch (err) {
      toast.error("Error revoking enrollment", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">License Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total of {enrollments.length} lifetime operational licenses issued.
          </p>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setError(null);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Manual License Grant
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-[#EBE2D6] shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-[#F7F2EB] border-b border-[#EBE2D6] text-slate-500 uppercase font-mono text-[10px]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Student</th>
              <th className="py-3.5 px-4 font-semibold">Course Program</th>
              <th className="py-3.5 px-4 font-semibold">Price Paid</th>
              <th className="py-3.5 px-4 font-semibold">Method</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Granted Date</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrollments.map((enr) => (
              <tr key={enr.id} className="hover:bg-[#F7F2EB]/50 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-bold text-[#1C2417] block">{enr.user.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{enr.user.email}</span>
                </td>
                <td className="py-4 px-4 font-bold text-slate-800 max-w-xs truncate">
                  {enr.course.title}
                </td>
                <td className="py-4 px-4 font-mono font-bold text-emerald-600">
                  €{enr.pricePaid}.00
                </td>
                <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                  {enr.paymentMethod}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      enr.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-[#8B9B6D]/15 text-[#384524] border border-[#8B9B6D]/30"
                    }`}
                  >
                    {enr.status}
                  </span>
                </td>
                <td className="py-4 px-4 font-mono text-slate-500">
                  {new Date(enr.enrolledAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() =>
                      handleRevoke(enr.id, enr.user.name, enr.course.title)
                    }
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors"
                    title="Revoke License"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Grant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Manual License Grant</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleGrant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Student
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Program / Lab
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} (€{c.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 disabled:opacity-50"
                >
                  {loading ? "Granting..." : "Grant License"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
