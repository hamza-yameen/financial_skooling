"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import ScrollProgressBar from "./ScrollProgressBar";
import { CurrencyCartProvider } from "./CurrencyCartContext";
import { Toaster } from "sonner";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/admin") || pathname.startsWith("/student");

  if (isDashboard) {
    return (
      <CurrencyCartProvider>
        <div className="min-h-screen bg-[#F7F2EB] text-[#1C2417] font-sans antialiased selection:bg-[#8B9B6D]/30 selection:text-[#2D3A20]">
          <ScrollProgressBar />
          <Toaster position="top-right" richColors closeButton theme="light" />
          {children}
        </div>
      </CurrencyCartProvider>
    );
  }

  return (
    <CurrencyCartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F2EB] text-[#1C2417] selection:bg-[#8B9B6D]/30 selection:text-[#2D3A20] font-sans antialiased">
        <ScrollProgressBar />
        <Toaster position="top-right" richColors closeButton theme="light" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </div>
    </CurrencyCartProvider>
  );
}
