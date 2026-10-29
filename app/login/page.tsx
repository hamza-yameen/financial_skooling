import React from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Sign In — Financial Skool",
};

export default function LoginPage() {
  return (
    <div className="relative overflow-hidden min-h-[85vh] flex items-center justify-center px-4 py-16">
      {/* Background ambient blooms */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[400px] bg-[#8B9B6D]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[400px] bg-[#BAC8A1]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full z-10">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
