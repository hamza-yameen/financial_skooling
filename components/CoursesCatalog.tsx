"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Filter,
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  Star,
  ShoppingBag,
  Check,
  Coins,
} from "lucide-react";
import { useCurrencyCart } from "./CurrencyCartContext";

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  price: number;
  creditsCost?: number;
  originalPrice: number | null;
  currency: string;
  level: string;
  duration: string;
  format: string;
  badge: string | null;
  coverImage: string | null;
  highlights: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    lessons: number;
    enrollments: number;
  };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export default function CoursesCatalog({
  courses,
  categories,
}: {
  courses: CourseItem[];
  categories: CategoryItem[];
}) {
  const { formatPrice, addToCart, isInCart, setIsCreditsModalOpen } = useCurrencyCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === "all" || course.category.slug === selectedCategory;

      const matchesLevel =
        selectedLevel === "all" || course.level === selectedLevel;

      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [courses, selectedCategory, selectedLevel, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Credits Top Bar Notice - Increase Style */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D5DEE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E3FFF3] border border-[#31F2BF]/40 flex items-center justify-center text-[#007554] shrink-0 font-mono">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#1D2A36] block">
              Unlock Any Program with Account Credits
            </span>
            <span className="text-[#657482]">
              Save up to 35% with credit packages. Credits never expire.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/credits"
            className="px-4 py-2 rounded-xl bg-[#1D2A36] hover:bg-[#132030] text-white font-bold text-xs shadow-xs transition-all cursor-pointer border border-[#132030]"
          >
            Buy Credits
          </Link>
          <Link
            href="/credits"
            className="px-4 py-2 rounded-xl bg-[#F5F8FA] hover:bg-[#E1E5E9] border border-[#D5DEE5] text-[#1D2A36] font-bold text-xs shadow-xs transition-all"
          >
            Pricing Table
          </Link>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#D5DEE5] backdrop-blur-xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#657482] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programs, modules, topics (e.g. Quant, Real Estate, Credit)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] focus:border-[#1D2A36] focus:ring-1 focus:ring-[#1D2A36] focus:outline-none text-xs text-[#1D2A36] placeholder-[#8995A1] font-medium transition-all"
          />
        </div>

        {/* Level Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#657482] whitespace-nowrap font-mono">Difficulty:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-3 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-semibold text-[#1D2A36] focus:border-[#1D2A36] focus:outline-none cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced / Institutional</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === "all"
              ? "bg-[#1D2A36] text-white shadow-xs border border-[#132030]"
              : "bg-white text-[#657482] hover:bg-[#F5F8FA] hover:text-[#1D2A36] border border-[#D5DEE5] shadow-xs"
          }`}
        >
          All Domains ({courses.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.slug
                ? "bg-[#1D2A36] text-white shadow-xs border border-[#132030]"
                : "bg-white text-[#657482] hover:bg-[#F5F8FA] hover:text-[#1D2A36] border border-[#D5DEE5] shadow-xs"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid Results */}
      {filteredCourses.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white border border-[#D5DEE5] space-y-3 shadow-xs">
          <p className="text-sm font-semibold text-[#657482]">No programs match your search criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedLevel("all");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-[#007554] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl bg-white border border-[#D5DEE5] p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-[#0C1927]/08 hover:border-[#8995A1] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Top ambient color bar on card */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1D2A36] via-[#007554] to-[#31F2BF] opacity-85 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/40">
                    {course.category.name}
                  </span>
                  {course.badge && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#132030] text-[#31F2BF] border border-[#31F2BF]/30 shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#31F2BF]" />
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-xl font-extrabold text-[#1D2A36] group-hover:text-[#007554] transition-colors tracking-tight line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#657482] mt-2 line-clamp-2 leading-relaxed">
                    {course.summary}
                  </p>
                </div>

                {/* Key Metadata Stats */}
                <div className="flex items-center gap-3 text-xs font-mono font-medium text-[#8995A1] py-1 border-y border-[#EDF1F5]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#007554]" />
                    {course._count.lessons} Modules
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8995A1]" />
                    {course.duration}
                  </span>
                </div>

                {/* Highlights List */}
                <ul className="space-y-2 text-xs text-[#657482] pt-1">
                  {course.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007554] shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-medium text-[#1D2A36]">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Footer & Price */}
              <div className="pt-6 mt-6 border-t border-[#EDF1F5] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#1D2A36] tracking-tight">
                      {formatPrice(course.price)}
                    </span>
                    {course.originalPrice && (
                      <span className="text-xs font-mono text-[#8995A1] line-through">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono font-bold text-[#007554] uppercase tracking-wider">
                      Lifetime
                    </span>
                    <span className="text-[#8995A1] text-[10px]">•</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-black text-[#007554] bg-[#E3FFF3] px-1.5 py-0.5 rounded-md border border-[#31F2BF]/30">
                      <Coins className="w-3 h-3 text-[#007554]" />
                      {course.creditsCost || Math.round(course.price / 10)} Cr
                    </span>
                  </div>
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
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isInCart(course.id)
                        ? "bg-[#E3FFF3] border-[#31F2BF]/50 text-[#007554]"
                        : "bg-white border-[#D5DEE5] text-[#657482] hover:text-[#1D2A36] hover:border-[#8995A1] hover:bg-[#F5F8FA]"
                    }`}
                    title={isInCart(course.id) ? "Already in Cart" : "Add to Cart"}
                  >
                    {isInCart(course.id) ? (
                      <Check className="w-4 h-4 text-[#007554]" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </button>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="px-4 py-2.5 rounded-xl bg-[#1D2A36] hover:bg-[#132030] text-white text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 border border-[#132030]"
                  >
                    Details
                    <ArrowRight className="w-3.5 h-3.5 text-[#31F2BF]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
