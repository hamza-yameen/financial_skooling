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
  Coins,
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
    { label: "Credit Packages", href: "/admin/credit-packages", icon: Coins },
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
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#D5DEE5] shadow-xs sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#132030] border border-[#31F2BF]/30 flex items-center justify-center text-[#31F2BF]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-bold text-[#1D2A36] text-sm">
            Admin <span className="text-[#007554]">Center</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-[#657482] hover:bg-[#F5F8FA]"
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
              <div className="w-9 h-9 rounded-xl bg-[#132030] border border-[#31F2BF]/30 p-[1.5px] shadow-xs flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-[#31F2BF]" />
              </div>
              <div>
                <span className="text-base font-bold text-[#1D2A36] tracking-tight group-hover:text-[#007554] transition-colors">
                  Financial <span className="text-[#007554]">Skool</span>
                </span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8995A1]">
                  ADMIN COMMAND
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-[#8995A1] hover:text-[#1D2A36]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8995A1] font-semibold px-3 block mb-2">
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#E3FFF3] text-[#007554] shadow-xs font-bold border-l-4 border-[#007554]"
                      : "text-[#657482] hover:text-[#1D2A36] hover:bg-[#F5F8FA]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#007554]" : "text-[#8995A1]"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom User Ribbon */}
        <div className="p-4 border-t border-[#EDF1F5] bg-[#F5F8FA] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#E3FFF3] border border-[#31F2BF]/30 flex items-center justify-center text-xs font-bold text-[#007554] shrink-0 font-mono">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1D2A36] truncate">{user.name}</p>
              <p className="text-[10px] text-[#007554] font-mono font-bold truncate">
                SUPER ADMINISTRATOR
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-1.5 rounded-lg text-[#8995A1] hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}

