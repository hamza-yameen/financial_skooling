"use client";

import React, { useState } from "react";
import { Users, Shield, User, ArrowUpDown, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface StudentItem {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  createdAt: string;
  _count: {
    enrollments: number;
    activities: number;
    lessonProgress: number;
  };
  enrollments: {
    id: string;
    course: { title: string };
  }[];
}

export default function AdminStudentsManager({
  initialStudents,
}: {
  initialStudents: StudentItem[];
}) {
  const [students, setStudents] = useState<StudentItem[]>(initialStudents);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggleRole = async (userId: string, currentRole: "STUDENT" | "ADMIN", name: string) => {
    const newRole = currentRole === "STUDENT" ? "ADMIN" : "STUDENT";
    setLoadingId(userId);
    const toastId = toast.loading(`Updating ${name}'s role to ${newRole}...`);

    try {
      const res = await fetch("/api/admin/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.id === userId ? { ...s, role: newRole } : s))
        );
        toast.success(`Role updated: ${name} is now ${newRole}!`, { id: toastId });
      } else {
        toast.error("Failed to update role", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error while updating role", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Student Name</th>
              <th className="py-3.5 px-4 font-semibold">Email</th>
              <th className="py-3.5 px-4 font-semibold">Registered</th>
              <th className="py-3.5 px-4 font-semibold">Licenses</th>
              <th className="py-3.5 px-4 font-semibold">Activity Count</th>
              <th className="py-3.5 px-4 font-semibold">Role</th>
              <th className="py-3.5 px-4 font-semibold text-right">Switch Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-4 font-bold text-[#1C2417] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#8B9B6D]/15 border border-[#8B9B6D]/30 flex items-center justify-center font-mono text-[#384524] text-xs font-bold">
                    {student.name.charAt(0)}
                  </div>
                  {student.name}
                </td>
                <td className="py-4 px-4 font-mono text-slate-500">{student.email}</td>
                <td className="py-4 px-4 font-mono text-slate-500">
                  {new Date(student.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <span className="font-mono font-bold text-emerald-600">
                    {student._count.enrollments} Programs
                  </span>
                </td>
                <td className="py-4 px-4 font-mono text-slate-600">
                  {student._count.activities} actions
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      student.role === "ADMIN"
                        ? "bg-[#8B9B6D]/15 text-[#384524] border border-[#8B9B6D]/30"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {student.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => toggleRole(student.id, student.role, student.name)}
                    disabled={loadingId === student.id}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 font-semibold text-[11px] transition-colors disabled:opacity-50"
                  >
                    Make {student.role === "STUDENT" ? "Admin" : "Student"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
