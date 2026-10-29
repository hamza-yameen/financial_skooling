"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Users,
  CreditCard,
  Activity,
  LogOut,
  ShieldAlert,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface AdminUserData {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
}

export default function AdminSidebar({ user }: { user: AdminUserData }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const adminNav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Courses & Lessons", href: "/admin/courses", icon: BookOpen },
    { label: "Domains & Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Student Directory", href: "/admin/students", icon: Users },
    { label: "License Ledger", href: "/admin/enrollments", icon: CreditCard },
    { label: "System Audit Log", href: "/admin/activity", icon: Activity },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    const toastId = toast.loading("Signing out...");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Signed out successfully", { id: toastId });
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
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3D4C2B] via-[#5C6E42] to-[#76885A] flex items-center justify-center text-white">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-bold text-[#1C2417] text-sm">
            Admin <span className="text-[#5C6E42]">Center</span>
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
        className={`fixed md:sticky top-0 left-0 z-50 md:z-0 w-72 h-screen bg-white border-r border-[#EBE2D6] shadow-sm flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Brand Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3D4C2B] via-[#5C6E42] to-[#8B9B6D] p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-[#5C6E42]" />
                </div>
              </div>
              <div>
                <span className="text-base font-bold text-[#1C2417] tracking-tight group-hover:text-[#5C6E42] transition-colors">
                  Financial <span className="text-[#5C6E42]">Skool</span>
                </span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-[#4A5836]">
                  ADMIN COMMAND
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4A5836] font-semibold px-3 block mb-2">
              ADMINISTRATION
            </span>
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#8B9B6D]/15 text-[#2E3C1B] shadow-xs font-bold border-l-4 border-[#5C6E42]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-[#F7F2EB]/60"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#5C6E42]" : "text-slate-400"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom User Ribbon */}
        <div className="p-4 border-t border-[#EBE2D6] bg-[#F7F2EB]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3D4C2B] via-[#5C6E42] to-[#76885A] flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1C2417] truncate">{user.name}</p>
              <p className="text-[10px] text-[#5C6E42] font-mono font-bold truncate">
                SUPER ADMINISTRATOR
              </p>
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
      </aside>
    </>
  );
}

