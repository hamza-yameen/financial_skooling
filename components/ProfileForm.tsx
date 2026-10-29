"use client";

import React, { useState } from "react";
import { User, Lock, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string | null;
}

export default function ProfileForm({ user }: { user: UserProfile }) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving profile preferences...");

    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile preferences updated successfully!", { id: toastId });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Account Info */}
      <div className="p-6 rounded-2xl bg-white border border-[#EBE2D6] shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#1C2417] uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-[#5C6E42]" />
          Student Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Registered Email
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Account Role
            </label>
            <input
              type="text"
              disabled
              value={user.role}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#8B9B6D]/15 border border-[#8B9B6D]/30 text-xs text-[#384524] font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#5C6E42] focus:ring-1 focus:ring-[#8B9B6D] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Operator Bio / Background
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Focus area (e.g. Real Estate Syndication, Macro Quant, Cashflow Systems)..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#5C6E42] focus:ring-1 focus:ring-[#8B9B6D] focus:outline-none"
          />
        </div>
      </div>

      {/* Security Credentials */}
      <div className="p-6 rounded-2xl bg-white border border-[#EBE2D6] shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#1C2417] uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#5C6E42]" />
          Security & Password Change (Optional)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#5C6E42] focus:ring-1 focus:ring-[#8B9B6D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#5C6E42] focus:ring-1 focus:ring-[#8B9B6D] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating Profile...
          </>
        ) : (
          "Save Preferences"
        )}
      </button>
    </form>
  );
}
