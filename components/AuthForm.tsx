"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<"login" | "register">(mode);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const toastId = toast.loading(
      currentMode === "login"
        ? "Authenticating credentials..."
        : "Creating your student profile..."
    );

    try {
      const endpoint = currentMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        currentMode === "login"
          ? { email, password }
          : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      toast.success(
        currentMode === "login"
          ? `Welcome back, ${data.user.name}!`
          : `Account registered successfully! Welcome to Financial Skool.`,
        { id: toastId }
      );

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/student/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      toast.error(err.message || "Authentication error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl bg-white/95 border border-[#EBE2D6] p-7 sm:p-9 backdrop-blur-2xl shadow-xl shadow-[#5C6E42]/10 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3D4C2B] via-[#5C6E42] to-[#8B9B6D] p-[2px] mx-auto shadow-md shadow-[#5C6E42]/20">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#5C6E42]" />
          </div>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[#1C2417]">
          {currentMode === "login" ? "Welcome Back" : "Create Operator Account"}
        </h2>
        <p className="text-xs text-[#4A5836] font-medium">
          {currentMode === "login"
            ? "Enter your credentials below to access your account."
            : "No email verification required. Start learning immediately."}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6] text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setCurrentMode("login");
            setError(null);
          }}
          className={`py-2.5 rounded-xl transition-all cursor-pointer ${
            currentMode === "login"
              ? "bg-white text-[#2E3C1B] shadow-xs"
              : "text-[#4A5836] hover:text-[#1C2417]"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentMode("register");
            setError(null);
          }}
          className={`py-2.5 rounded-xl transition-all cursor-pointer ${
            currentMode === "register"
              ? "bg-white text-[#2E3C1B] shadow-xs"
              : "text-[#4A5836] hover:text-[#1C2417]"
          }`}
        >
          New Student
        </button>
      </div>

      {/* Actual Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentMode === "register" && (
          <div>
            <label className="block text-xs font-semibold text-[#1C2417] mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8B9B6D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7F2EB]/50 border border-[#EBE2D6] text-xs text-[#1C2417] placeholder-[#4A5836]/50 focus:border-[#5C6E42] focus:ring-2 focus:ring-[#8B9B6D]/20 focus:outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#1C2417] mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8B9B6D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@financialskool.com"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7F2EB]/50 border border-[#EBE2D6] text-xs text-[#1C2417] placeholder-[#4A5836]/50 focus:border-[#5C6E42] focus:ring-2 focus:ring-[#8B9B6D]/20 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1C2417] mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8B9B6D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7F2EB]/50 border border-[#EBE2D6] text-xs text-[#1C2417] placeholder-[#4A5836]/50 focus:border-[#5C6E42] focus:ring-2 focus:ring-[#8B9B6D]/20 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] text-white font-extrabold text-xs shadow-lg shadow-[#5C6E42]/25 hover:shadow-[#5C6E42]/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Processing...
            </span>
          ) : (
            <>
              {currentMode === "login" ? "Sign In to Dashboard" : "Register Student Profile"}
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
