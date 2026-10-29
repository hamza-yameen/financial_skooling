"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ShoppingBag,
  Menu,
  X,
  Check,
  ChevronRight,
  ShieldAlert,
  LayoutDashboard,
  BookOpen,
  Cpu,
  Mail,
  HelpCircle,
} from "lucide-react";
import BrandIcon from "./BrandIcon";
import { useCurrencyCart, Currency } from "./CurrencyCartContext";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currency, setCurrency, cartCount, setIsCartOpen } = useCurrencyCart();

  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Popups & Drawers
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSession();
    setMenuDrawerOpen(false);
    setCurrencyDropdownOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setCurrencyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setMenuDrawerOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navigationItems = [
    { num: "01", label: "PROGRAMS", href: "/courses" },
    { num: "02", label: "HOW IT WORKS", href: "/about" },
    { num: "03", label: "RISK SIMULATOR", href: "/simulator" },
    { num: "04", label: "ABOUT", href: "/about#institutional" },
    { num: "05", label: "FAQ & HELP", href: "/faq" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#EBE2D6] bg-[#F7F2EB]/90 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo (Left) */}
          <Link href="/" className="flex items-center gap-3 group">
            <BrandIcon className="w-10 h-10 shadow-sm group-hover:scale-105 transition-all duration-300 rounded-2xl" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#1C2417] group-hover:text-[#5C6E42] transition-colors">
                  Financial <span className="text-gradient-primary">Skool</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#8B9B6D]/15 text-[#4A5836] border border-[#8B9B6D]/30 shadow-xs hidden sm:inline-block">
                  PRO 🚀
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-[#7E8773] font-mono hidden sm:block font-semibold">
                QUANTITATIVE WEALTH SYSTEMS
              </p>
            </div>
          </Link>

          {/* Right Controls matching the exact screenshot layout */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* 1. Language & Currency Selector Pill */}
            <div className="relative" ref={currencyDropdownRef}>
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-full bg-white hover:bg-[#F7F2EB] border border-[#EBE2D6] text-xs font-semibold text-[#1C2417] shadow-xs hover:border-[#8B9B6D]/50 transition-all cursor-pointer"
              >
                <span className="text-sm">🇬🇧</span>
                <span className="font-mono font-bold">
                  EN • {currency}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7E8773]" />
              </button>

              {/* Currency Dropdown Popup (matching screenshot 4) */}
              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white border border-[#EBE2D6] py-1.5 shadow-xl shadow-[#8B9B6D]/15 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency("EUR");
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full flex items-center px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer text-left ${
                      currency === "EUR" ? "text-[#2D391C] bg-[#8B9B6D]/15" : "text-[#1C2417] hover:bg-[#F7F2EB]"
                    }`}
                  >
                    <span className="w-5 text-sm font-black text-[#5C6E42]">
                      {currency === "EUR" ? "✓" : ""}
                    </span>
                    <span>EUR (€)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrency("GBP");
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full flex items-center px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer text-left ${
                      currency === "GBP" ? "text-[#2D391C] bg-[#8B9B6D]/15" : "text-[#1C2417] hover:bg-[#F7F2EB]"
                    }`}
                  >
                    <span className="w-5 text-sm font-black text-[#5C6E42]">
                      {currency === "GBP" ? "✓" : ""}
                    </span>
                    <span>GBP (£)</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Cart Pill Button (matching screenshot 1 & 4) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white hover:bg-[#F7F2EB] border border-[#EBE2D6] text-xs font-bold text-[#1C2417] shadow-xs hover:border-[#8B9B6D]/50 transition-all cursor-pointer group"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#8B9B6D] group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[#1C2417]">Cart</span>
              <span className="w-5 h-5 rounded-full bg-[#8B9B6D] text-white font-mono text-[10px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>

            {/* 3. Menu Button (Sage & Olive Gradient - No Black) */}
            <button
              type="button"
              onClick={() => setMenuDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#8B9B6D]/30 hover:shadow-[#8B9B6D]/45 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Menu</span>
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => setMenuDrawerOpen(false)}
            className="fixed inset-0 bg-[#1C2417]/35 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-md bg-[#F7F2EB] border-l border-[#EBE2D6] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="p-6 sm:p-7 space-y-6">
                {/* Top Drawer Controls */}
                <div className="flex items-center justify-between">
                  <Link
                    href="/courses"
                    onClick={() => setMenuDrawerOpen(false)}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] text-white font-extrabold text-xs shadow-md shadow-[#8B9B6D]/25 hover:scale-105 active:scale-95 transition-all"
                  >
                    Explore Programs
                  </Link>

                  <button
                    onClick={() => setMenuDrawerOpen(false)}
                    className="w-9 h-9 rounded-full bg-white hover:bg-[#EBE2D6] text-[#7E8773] hover:text-[#1C2417] flex items-center justify-center transition-colors cursor-pointer border border-[#EBE2D6]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* User Profile Card */}
                {user ? (
                  <div className="p-5 rounded-3xl bg-white border border-[#EBE2D6] shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5C6E42] via-[#8B9B6D] to-[#BAC8A1] flex items-center justify-center text-xs font-black text-white shadow-xs">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#1C2417]">{user.name}</h3>
                          <p className="text-[11px] text-[#7E8773] font-mono truncate max-w-[160px]">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>

                    {/* Single Direct Dashboard Button */}
                    <Link
                      href={user.role === "ADMIN" ? "/admin" : "/student/dashboard"}
                      onClick={() => setMenuDrawerOpen(false)}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] hover:opacity-95 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-[#8B9B6D]/25 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Go to Dashboard</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-80" />
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 rounded-3xl bg-white border border-[#EBE2D6] shadow-xs">
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        href="/login"
                        onClick={() => setMenuDrawerOpen(false)}
                        className="py-2.5 px-3 rounded-xl bg-[#F7F2EB] hover:bg-[#EBE2D6] border border-[#EBE2D6] text-center text-xs font-bold text-[#1C2417] shadow-xs hover:border-[#8B9B6D]/50 transition-all cursor-pointer"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMenuDrawerOpen(false)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] hover:opacity-95 text-center text-xs font-bold text-white shadow-md shadow-[#8B9B6D]/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}

                {/* Section: NAVIGATION */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7E8773] block px-1">
                    NAVIGATION
                  </span>

                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuDrawerOpen(false)}
                        className="p-3.5 rounded-2xl bg-white hover:bg-[#8B9B6D]/10 border border-[#EBE2D6] hover:border-[#8B9B6D]/40 flex items-center justify-between transition-all group shadow-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-[#F7F2EB] border border-[#EBE2D6] text-[#5C6E42] group-hover:bg-[#8B9B6D] group-hover:text-white group-hover:border-[#8B9B6D] text-xs font-mono font-bold flex items-center justify-center transition-colors">
                            {item.num}
                          </span>
                          <span className="text-xs font-extrabold text-[#1C2417] group-hover:text-[#4A5836] tracking-wide">
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#7E8773] group-hover:text-[#5C6E42] group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Full-Width Explore Button */}
              <div className="p-6 border-t border-[#EBE2D6] bg-[#F7F2EB]">
                <Link
                  href="/courses"
                  onClick={() => setMenuDrawerOpen(false)}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] hover:opacity-95 text-white font-extrabold text-xs tracking-wider uppercase text-center block shadow-lg shadow-[#8B9B6D]/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  EXPLORE ALL PACKAGES
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
