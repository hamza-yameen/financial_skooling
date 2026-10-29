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
} from "lucide-react";
import { useCurrencyCart } from "./CurrencyCartContext";

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  price: number;
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
  const { formatPrice, addToCart, isInCart } = useCurrencyCart();
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
      {/* Search and Filter Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#EBE2D6] backdrop-blur-xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7E8773] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programs, modules, topics (e.g. Quant, Real Estate, Credit)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6] focus:border-[#8B9B6D] focus:ring-2 focus:ring-[#8B9B6D]/20 focus:outline-none text-xs text-[#1C2417] placeholder-[#7E8773] font-medium transition-all"
          />
        </div>

        {/* Level Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#636B58] whitespace-nowrap">Difficulty:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6] text-xs font-semibold text-[#1C2417] focus:border-[#8B9B6D] focus:outline-none cursor-pointer"
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
          className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] text-white shadow-md shadow-[#8B9B6D]/30 scale-105"
              : "bg-white text-[#636B58] hover:bg-[#F7F2EB] hover:text-[#1C2417] border border-[#EBE2D6] shadow-xs"
          }`}
        >
          All Domains ({courses.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.slug
                ? "bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] text-white shadow-md shadow-[#8B9B6D]/30 scale-105"
                : "bg-white text-[#636B58] hover:bg-[#F7F2EB] hover:text-[#1C2417] border border-[#EBE2D6] shadow-xs"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid Results */}
      {filteredCourses.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <p className="text-sm font-semibold text-slate-600">No programs match your search criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedLevel("all");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-[#5C6E42] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-3xl bg-white border border-[#EBE2D6] p-6 flex flex-col justify-between shadow-xs hover:shadow-2xl hover:shadow-[#8B9B6D]/15 hover:border-[#8B9B6D] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
            >
              {/* Top ambient color bar on card */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5C6E42] via-[#8B9B6D] to-[#BAC8A1] opacity-85 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8B9B6D]/15 text-[#4A5836] border border-[#8B9B6D]/30">
                    {course.category.name}
                  </span>
                  {course.badge && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EBE2D6] text-[#4A5836] border border-[#D8CEBE] shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#5C6E42]" />
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Title & Summary */}
                <div>
                  <h3 className="text-xl font-extrabold text-[#1C2417] group-hover:text-[#5C6E42] transition-colors tracking-tight line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#636B58] mt-2 line-clamp-2 leading-relaxed">
                    {course.summary}
                  </p>
                </div>

                {/* Key Metadata Stats */}
                <div className="flex items-center gap-3 text-xs font-mono font-medium text-[#7E8773] py-1 border-y border-[#EBE2D6]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#5C6E42]" />
                    {course._count.lessons} Modules
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7E8773]" />
                    {course.duration}
                  </span>
                </div>

                {/* Highlights List */}
                <ul className="space-y-2 text-xs text-[#636B58] pt-1">
                  {course.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5C6E42] shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-medium text-[#1C2417]">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Footer & Price */}
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
                    className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                      isInCart(course.id)
                        ? "bg-[#8B9B6D]/15 border-[#8B9B6D]/40 text-[#4A5836]"
                        : "bg-white border-[#EBE2D6] text-[#636B58] hover:text-[#5C6E42] hover:border-[#8B9B6D]/50 hover:bg-[#F7F2EB]"
                    }`}
                    title={isInCart(course.id) ? "Already in Cart" : "Add to Cart"}
                  >
                    {isInCart(course.id) ? (
                      <Check className="w-4 h-4 text-[#5C6E42]" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </button>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#8B9B6D]/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    Details
                    <ArrowRight className="w-3.5 h-3.5" />
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
