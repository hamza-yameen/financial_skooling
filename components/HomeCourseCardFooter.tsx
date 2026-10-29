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
    <div className="pt-6 mt-6 border-t border-[#EBE2D6] flex items-center justify-between">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#1C2417] tracking-tight">
            {formatPrice(course.price)}
          </span>
          {course.originalPrice && (
            <span className="text-xs font-mono text-[#7E8773] line-through">
              {formatPrice(course.originalPrice)}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono font-bold text-[#5C6E42] block uppercase tracking-wider">
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
          className={`p-2 rounded-full border transition-all cursor-pointer ${
            isInCart(course.id)
              ? "bg-[#8B9B6D]/15 border-[#8B9B6D]/40 text-[#4A5836]"
              : "bg-white border-[#EBE2D6] text-[#636B58] hover:text-[#5C6E42] hover:border-[#8B9B6D]/50 hover:bg-[#F7F2EB]"
          }`}
          title={isInCart(course.id) ? "Already in Cart" : "Add to Cart"}
        >
          {isInCart(course.id) ? (
            <Check className="w-3.5 h-3.5 text-[#5C6E42]" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5" />
          )}
        </button>

        <Link
          href={`/courses/${course.slug}`}
          className="px-3 py-1.5 text-xs font-bold rounded-full bg-[#F7F2EB] hover:bg-[#EBE2D6] text-[#1C2417] border border-[#EBE2D6] transition-colors"
        >
          Syllabus
        </Link>
        <Link
          href={`/checkout/${course.slug}`}
          className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] hover:opacity-95 text-white shadow-md shadow-[#8B9B6D]/25 hover:scale-105 active:scale-95 transition-all"
        >
          Enroll
        </Link>
      </div>
    </div>
  );
}
