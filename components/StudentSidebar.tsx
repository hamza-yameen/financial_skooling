"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  TrendingUp,
  LayoutDashboard,
  BookOpen,
  Activity,
  User,
  Cpu,
  LogOut,
  Menu,
  X,
  Flame,
  ArrowUpRight,
  ShieldAlert,
  Coins,
} from "lucide-react";
import BrandIcon from "./BrandIcon";
import { toast } from "sonner";
import { useCurrencyCart } from "./CurrencyCartContext";

interface SessionUserData {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
}

export default function StudentSidebar({ user }: { user: SessionUserData }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userCredits, setIsCreditsModalOpen } = useCurrencyCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Enrolled Courses", href: "/student/courses", icon: BookOpen },
    { label: "Credits & Wallet", href: "/student/credits", icon: Coins, badge: "Wallet" },
    { label: "Activity Stream", href: "/student/activity", icon: Activity },
    { label: "Profile & Settings", href: "/student/profile", icon: User },
  ];

  const externalLinks = [
    { label: "Risk Simulator Tool", href: "/simulator", icon: Cpu, badge: "Live" },
    { label: "Explore New Programs", href: "/courses", icon: ArrowUpRight },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    const toastId = toast.loading("Signing out...");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Successfully signed out", { id: toastId });
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out", { id: toastId });
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Sticky Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#EBE2D6] shadow-sm sticky top-0 z-40">
        <Link href="/student/dashboard" className="flex items-center gap-2.5">
          <BrandIcon className="w-8 h-8 rounded-lg shadow-xs" />
          <span className="font-bold text-[#1C2417] text-sm">
            Financial <span className="text-[#5C6E42]">Skool</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-0 w-72 h-screen bg-white border-r border-[#D5DEE5] shadow-xs flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Brand Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <BrandIcon className="w-9 h-9 rounded-xl shadow-xs" />
              <div>
                <span className="text-base font-bold text-[#1D2A36] tracking-tight group-hover:text-[#007554] transition-colors">
                  Financial <span className="text-[#007554]">Skool</span>
                </span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-[#657482]">
                  STUDENT TERMINAL
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-[#657482] hover:text-[#1D2A36]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Status Card - Increase Style */}
          <div className="p-3.5 rounded-xl bg-[#E3FFF3] border border-[#31F2BF]/40 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1D2A36] flex items-center gap-1.5 font-mono">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                5-Day Study Streak
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#31F2BF]/30 text-[#007554] border border-[#31F2BF]/50 font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[#007554] leading-snug">
              Consistent daily review reinforces quantitative risk principles.
            </p>
          </div>

          {/* Credits Wallet Widget */}
          <div className="p-3.5 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] text-xs space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1D2A36] flex items-center gap-1.5 font-mono">
                <Coins className="w-4 h-4 text-[#007554]" />
                Credits Balance
              </span>
              <span className="text-xs font-black font-mono text-[#007554]">
                {userCredits !== null ? `${userCredits} Cr` : "0 Cr"}
              </span>
            </div>
            <Link
              href="/credits"
              className="w-full py-1.5 rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-white text-[11px] font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1 border border-[#132030]"
            >
              <span>+ Top Up Credits</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#657482] font-semibold px-3 block mb-2">
              WORKSPACE
            </span>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#EDF1F5] text-[#1D2A36] shadow-xs font-bold border-l-4 border-[#1D2A36]"
                      : "text-[#657482] hover:text-[#1D2A36] hover:bg-[#F5F8FA]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#1D2A36]" : "text-[#8995A1]"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Institutional Utilities & Catalog Links */}
          <div className="space-y-1 pt-2 border-t border-[#EBE2D6]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4A5836] font-semibold px-3 block mb-2">
              UTILITIES & CATALOG
            </span>
            {externalLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-[#F7F2EB] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#8B9B6D]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#8B9B6D]/20 text-[#384524] border border-[#8B9B6D]/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom User Profile Ribbon */}
        <div className="p-4 border-t border-[#EBE2D6] bg-[#F7F2EB]/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3D4C2B] via-[#5C6E42] to-[#76885A] flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1C2417] truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Admin Toggle (for admin users evaluating student side) */}
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#8B9B6D]/15 hover:bg-[#8B9B6D]/25 text-[#384524] text-[11px] font-semibold transition-colors border border-[#8B9B6D]/30"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#5C6E42]" />
              Switch to Admin Panel
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

