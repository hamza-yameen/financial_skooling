"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { useCurrencyCart } from "./CurrencyCartContext";

interface HomeCourseCardFooterProps {
  course: {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice: number | null;
    duration: string;
    coverImage: string | null;
  };
}

export default function HomeCourseCardFooter({ course }: HomeCourseCardFooterProps) {
  const { formatPrice, addToCart, isInCart } = useCurrencyCart();

  return (
    <div className="pt-5 mt-5 border-t border-[#D5DEE5] flex items-center justify-between">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#1D2A36] tracking-tight font-mono">
            {formatPrice(course.price)}
          </span>
          {course.originalPrice && (
            <span className="text-xs font-mono text-[#8995A1] line-through">
              {formatPrice(course.originalPrice)}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono font-bold text-[#007554] block uppercase tracking-wider">
          Lifetime • No Subs
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            addToCart({
              id: course.id,
              title: course.title,
              slug: course.slug,
              price: course.price,
              duration: course.duration,
              coverImage: course.coverImage,
            })
          }
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            isInCart(course.id)
              ? "bg-[#E3FFF3] border-[#31F2BF]/50 text-[#007554]"
              : "bg-white border-[#D5DEE5] text-[#657482] hover:text-[#1D2A36] hover:border-[#8995A1] hover:bg-[#F5F8FA]"
          }`}
          title={isInCart(course.id) ? "Already in Cart" : "Add to Cart"}
        >
          {isInCart(course.id) ? (
            <Check className="w-3.5 h-3.5 text-[#007554]" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5" />
          )}
        </button>

        <Link
          href={`/courses/${course.slug}`}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#F5F8FA] hover:bg-[#E1E5E9] text-[#1D2A36] border border-[#D5DEE5] transition-colors"
        >
          Syllabus
        </Link>
        <Link
          href={`/checkout/${course.slug}`}
          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-white shadow-xs hover:scale-105 active:scale-95 transition-all border border-[#132030]"
        >
          Enroll
        </Link>
      </div>
    </div>
  );
}
