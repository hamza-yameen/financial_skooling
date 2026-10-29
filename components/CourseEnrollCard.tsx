"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Check,
} from "lucide-react";
import { useCurrencyCart } from "./CurrencyCartContext";

interface CourseEnrollCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice: number | null;
    duration: string;
    coverImage: string | null;
    highlights: string[];
  };
}

export default function CourseEnrollCard({ course }: CourseEnrollCardProps) {
  const { formatPrice, addToCart, isInCart } = useCurrencyCart();

  const handleAddToCart = () => {
    addToCart({
      id: course.id,
      title: course.title,
      slug: course.slug,
      price: course.price,
      duration: course.duration,
      coverImage: course.coverImage,
    });
  };

  return (
    <div className="sticky top-28 rounded-3xl bg-white border border-[#EBE2D6] p-7 shadow-xl shadow-[#8B9B6D]/10 space-y-6">
      {/* Price Header */}
      <div>
        <span className="text-[10px] text-[#7E8773] font-mono uppercase tracking-wider font-bold block">
          ONE-TIME PERPETUAL LICENSE
        </span>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-4xl font-black text-[#1C2417] tracking-tight">
            {formatPrice(course.price)}
          </span>
          {course.originalPrice && (
            <span className="text-base text-[#7E8773] line-through">
              {formatPrice(course.originalPrice)}
            </span>
          )}
          <span className="text-xs font-bold text-[#4A5836] bg-[#8B9B6D]/15 px-2.5 py-0.5 rounded-full border border-[#8B9B6D]/30">
            SAVE 50%
          </span>
        </div>
        <p className="text-[11px] text-[#636B58] mt-1">
          Zero recurring fees. Instant access to all manuals & updates.
        </p>
      </div>

      {/* Action Buttons: Enroll Now + Add to Cart */}
      <div className="space-y-2.5">
        <Link
          href={`/checkout/${course.slug}`}
          className="w-full py-4 rounded-full bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#8B9B6D]/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          Enroll Now (Instant Unlock)
          <ArrowRight className="w-4 h-4" />
        </Link>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full py-3 rounded-full border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isInCart(course.id)
              ? "bg-[#8B9B6D]/15 border-[#8B9B6D]/40 text-[#4A5836]"
              : "bg-[#F7F2EB] hover:bg-[#EBE2D6] border-[#EBE2D6] text-[#1C2417] hover:border-[#8B9B6D]/40"
          }`}
        >
          {isInCart(course.id) ? (
            <>
              <Check className="w-4 h-4 text-[#5C6E42]" />
              In Study Cart — View Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[#5C6E42]" />
              Add to Study Cart
            </>
          )}
        </button>
      </div>

      {/* Highlights List */}
      <div className="space-y-3 pt-4 border-t border-[#EBE2D6]">
        <span className="text-xs font-bold text-[#1C2417] uppercase tracking-wider block">
          What Is Included:
        </span>
        <ul className="space-y-2.5 text-xs text-[#636B58]">
          {course.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5C6E42] shrink-0 mt-0.5" />
              <span className="font-medium text-[#1C2417]">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trust Badges */}
      <div className="p-4 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6] space-y-2 text-[11px] text-[#636B58]">
        <div className="flex items-center gap-2 text-[#1C2417] font-bold">
          <Lock className="w-3.5 h-3.5 text-[#5C6E42]" />
          14-Day Operational Guarantee
        </div>
        <p className="leading-relaxed">
          If the technical depth does not surpass any financial program you have experienced,
          contact support within 14 days for a prompt refund.
        </p>
      </div>
    </div>
  );
}
