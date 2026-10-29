import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Financial Skool — Modern Wealth & Quantitative Systems Architecture",
  description:
    "Institutional wealth engineering, manual-first curriculum, real estate underwriting, digital cashflow automation, and systematic quantitative risk engines. Zero hype.",
  keywords: [
    "Financial Skool",
    "Quantitative Trading",
    "Wealth Architecture",
    "Real Estate Underwriting",
    "Risk Simulator",
    "Credit Systems",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
