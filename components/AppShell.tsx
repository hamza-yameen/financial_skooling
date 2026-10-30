"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import BuyCreditsModal from "./BuyCreditsModal";
import ScrollProgressBar from "./ScrollProgressBar";
import { CurrencyCartProvider } from "./CurrencyCartContext";
import { Toaster } from "sonner";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/admin") || pathname.startsWith("/student");
  const isHomePage = pathname === "/";

  if (isDashboard) {
    return (
      <CurrencyCartProvider>
        <div className="min-h-screen bg-[#EDF1F5] text-[#1D2A36] font-sans antialiased selection:bg-[#31F2BF]/30 selection:text-[#053226]">
          <ScrollProgressBar />
          <Toaster position="top-right" richColors closeButton theme="light" />
          <BuyCreditsModal />
          {children}
        </div>
      </CurrencyCartProvider>
    );
  }

  return (
    <CurrencyCartProvider>
      <div className="min-h-screen flex flex-col bg-[#EDF1F5] text-[#1D2A36] selection:bg-[#31F2BF]/30 selection:text-[#053226] font-sans antialiased">
        <ScrollProgressBar />
        <Toaster position="top-right" richColors closeButton theme="light" />
        {!isHomePage && <Navbar />}
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <BuyCreditsModal />
      </div>
    </CurrencyCartProvider>
  );
}
