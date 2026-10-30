"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Check,
  Coins,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrencyCart } from "./CurrencyCartContext";

interface CourseEnrollCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    price: number;
    creditsCost?: number;
    originalPrice: number | null;
    duration: string;
    coverImage: string | null;
    highlights: string[];
  };
}

export default function CourseEnrollCard({ course }: CourseEnrollCardProps) {
  const router = useRouter();
  const {
    formatPrice,
    addToCart,
    isInCart,
    userCredits,
    setIsCreditsModalOpen,
    refreshCredits,
  } = useCurrencyCart();

  const creditCost = course.creditsCost || Math.max(10, Math.round(course.price / 10));
  const hasEnoughCredits = userCredits !== null && userCredits >= creditCost;
  const [enrollingWithCredits, setEnrollingWithCredits] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: course.id,
      title: course.title,
      slug: course.slug,
      price: course.price,
      creditsCost: creditCost,
      duration: course.duration,
      coverImage: course.coverImage,
    });
  };

  const handleEnrollWithCredits = async () => {
    if (userCredits === null) {
      // Guest: redirect to checkout where they can sign in or use credits
      router.push(`/checkout/${course.slug}?method=credits`);
      return;
    }

    if (!hasEnoughCredits) {
      toast.info(
        `You need ${creditCost - (userCredits ?? 0)} more credits. Choose a top-up package to continue.`
      );
      router.push("/credits");
      return;
    }

    setEnrollingWithCredits(true);
    const toastId = toast.loading(`Unlocking course with ${creditCost} credits...`);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: course.slug,
          paymentMethod: "CREDITS",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to enroll with credits");
      }

      await refreshCredits();
      toast.success("Enrolled successfully! Opening course player...", {
        id: toastId,
      });
      router.push(data.redirectUrl || `/student/courses/${course.slug}`);
      router.refresh();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to enroll with credits";
      toast.error(msg, { id: toastId });
      setEnrollingWithCredits(false);
    }
  };

  return (
    <div className="sticky top-28 rounded-2xl bg-white border border-[#D5DEE5] p-7 shadow-lg shadow-[#0C1927]/06 space-y-6">
      {/* Price Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#657482] font-mono uppercase tracking-wider font-bold block">
            ONE-TIME PERPETUAL LICENSE
          </span>
          <span className="text-[10px] font-bold text-[#007554] bg-[#E3FFF3] px-2.5 py-0.5 rounded-full border border-[#31F2BF]/40 font-mono">
            {creditCost} CREDITS
          </span>
        </div>

        <div className="flex items-baseline gap-3 mt-1.5">
          <span className="text-4xl font-black text-[#1D2A36] tracking-tight font-mono">
            {formatPrice(course.price)}
          </span>
          {course.originalPrice && (
            <span className="text-base text-[#8995A1] line-through font-mono">
              {formatPrice(course.originalPrice)}
            </span>
          )}
          <span className="text-xs font-bold text-[#007554] bg-[#E3FFF3] px-2.5 py-0.5 rounded-full border border-[#31F2BF]/40 font-mono">
            SAVE 50%
          </span>
        </div>

        {/* Credit Option Highlight */}
        <div className="mt-3 p-3 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#007554]" />
            <span className="text-xs font-bold text-[#1D2A36]">
              Or unlock with {creditCost} Credits
            </span>
          </div>
          {userCredits !== null ? (
            <span className="text-[11px] font-mono font-bold text-[#007554]">
              Balance: {userCredits} Cr
            </span>
          ) : (
            <Link
              href="/credits"
              className="text-[11px] font-bold text-[#007554] hover:underline cursor-pointer font-mono"
            >
              Get Credits
            </Link>
          )}
        </div>
      </div>

      {/* Action Buttons: Enroll with Credits, Standard Checkout, Add to Cart */}
      <div className="space-y-2.5">
        {/* Option 1: Instant Enroll with Credits */}
        <button
          type="button"
          onClick={handleEnrollWithCredits}
          disabled={enrollingWithCredits}
          className="w-full py-3.5 rounded-xl bg-[#1D2A36] hover:bg-[#132030] text-white font-extrabold text-sm shadow-md shadow-[#1D2A36]/15 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 border border-[#132030]"
        >
          {enrollingWithCredits ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Unlocking Curriculum...</span>
            </>
          ) : hasEnoughCredits ? (
            <>
              <Coins className="w-4 h-4 text-[#31F2BF]" />
              <span>Unlock Instantly ({creditCost} Credits)</span>
            </>
          ) : userCredits !== null ? (
            <>
              <Coins className="w-4 h-4 text-[#31F2BF]" />
              <span>Top Up & Unlock ({creditCost} Credits)</span>
            </>
          ) : (
            <>
              <Coins className="w-4 h-4 text-[#31F2BF]" />
              <span>Unlock with {creditCost} Credits</span>
            </>
          )}
        </button>

        {/* Option 2: Direct Card / Bank Checkout */}
        <Link
          href={`/checkout/${course.slug}`}
          className="w-full py-3 rounded-xl bg-[#007554] hover:bg-[#053226] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
        >
          Pay {formatPrice(course.price)} with Card / Wire
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* Option 3: Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isInCart(course.id)
              ? "bg-[#E3FFF3] border-[#31F2BF]/50 text-[#007554]"
              : "bg-[#F5F8FA] hover:bg-[#E1E5E9] border-[#D5DEE5] text-[#1D2A36] hover:border-[#8995A1]"
          }`}
        >
          {isInCart(course.id) ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#007554]" />
              In Study Cart — View Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 text-[#007554]" />
              Add to Study Cart
            </>
          )}
        </button>
      </div>

      {/* Highlights List */}
      <div className="space-y-3 pt-4 border-t border-[#D5DEE5]">
        <span className="text-[10px] font-mono uppercase font-bold text-[#657482] tracking-wider block">
          INCLUDED IN THIS LICENSE
        </span>
        <ul className="space-y-2 text-xs text-[#657482]">
          {course.highlights.slice(0, 4).map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#007554] shrink-0 mt-0.5" />
              <span className="text-[#1D2A36] font-medium">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Security Guarantee */}
      <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] flex items-center gap-3 text-xs text-[#657482]">
        <Lock className="w-4 h-4 text-[#007554] shrink-0" />
        <div>
          <span className="font-bold text-[#1D2A36] block">
            Direct & Safe Enrollment
          </span>
          <span className="text-[11px] text-[#8995A1]">
            Instant field manual downloads & simulator access.
          </span>
        </div>
      </div>
    </div>
  );
}
