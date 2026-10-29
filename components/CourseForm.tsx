"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CategoryOption {
  id: string;
  name: string;
}

interface CourseFormData {
  id?: string;
  title: string;
  slug: string;
  tagline: string;
  summary: string;
  description: string;
  price: number;
  originalPrice: number | null;
  level: string;
  duration: string;
  format: string;
  published: boolean;
  featured: boolean;
  order: number;
  badge: string | null;
  coverImage: string | null;
  highlights: string[];
  whatYouWillLearn: string[];
  requirements: string[];
  categoryId: string;
}

export default function CourseForm({
  categories,
  initialData,
}: {
  categories: CategoryOption[];
  initialData?: CourseFormData;
}) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [tagline, setTagline] = useState(initialData?.tagline || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "249");
  const [originalPrice, setOriginalPrice] = useState(
    initialData?.originalPrice ? String(initialData.originalPrice) : "499"
  );
  const [level, setLevel] = useState(initialData?.level || "BEGINNER");
  const [duration, setDuration] = useState(initialData?.duration || "4 Core Modules • 56-Page Manuals");
  const [format, setFormat] = useState(initialData?.format || "PDF-First + Interactive Lab");
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [order, setOrder] = useState(initialData?.order ? String(initialData.order) : "1");
  const [badge, setBadge] = useState(initialData?.badge || "FLAGSHIP PROGRAM");
  const [coverImage, setCoverImage] = useState(
    initialData?.coverImage ||
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || (categories[0]?.id || "")
  );

  const [highlightsText, setHighlightsText] = useState(
    initialData?.highlights ? initialData.highlights.join("\n") : ""
  );
  const [learnText, setLearnText] = useState(
    initialData?.whatYouWillLearn ? initialData.whatYouWillLearn.join("\n") : ""
  );
  const [reqText, setReqText] = useState(
    initialData?.requirements ? initialData.requirements.join("\n") : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const toastId = toast.loading(isEditing ? "Updating course parameters..." : "Creating new program...");

    const highlights = highlightsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const whatYouWillLearn = learnText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const requirements = reqText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      tagline,
      summary,
      description,
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      level,
      duration,
      format,
      published,
      featured,
      order: parseInt(order, 10) || 0,
      badge: badge || null,
      coverImage,
      categoryId,
      highlights,
      whatYouWillLearn,
      requirements,
    };

    try {
      const url = isEditing
        ? `/api/admin/courses/${initialData.id}`
        : "/api/admin/courses";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save course");
      }

      toast.success(isEditing ? `"${title}" updated successfully!` : `"${title}" created!`, { id: toastId });
      router.push("/admin/courses");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "Failed to save course", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link
          href="/admin/courses"
          className="text-xs font-mono text-slate-500 hover:text-[#5C6E42] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Courses
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : isEditing ? "Update Course" : "Publish Program"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          1. General Program Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Program Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Master Program in Modern Wealth"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. master-program-wealth"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-[#384524] focus:bg-white focus:border-[#5C6E42] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category / Domain *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Difficulty Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none cursor-pointer"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="ALL_LEVELS">All Levels</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Program Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Concise, high-impact one-liner"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Executive Summary
          </label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="High-level overview appearing in catalog cards..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
          />
        </div>
      </div>

      {/* Pricing & Operations */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          2. Pricing, Order & Publishing Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Price (EUR €) *
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-emerald-600 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Original Price (EUR €)
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 499"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-400 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catalog Order #
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-[#384524] focus:bg-white focus:border-[#5C6E42] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Badge Tag
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. FLAGSHIP"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Duration Spec
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Format Spec
            </label>
            <input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Cover Image URL
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono focus:bg-white focus:border-[#5C6E42] focus:outline-none"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#5C6E42] focus:ring-[#8B9B6D]"
            />
            <span className="font-semibold">Published (Visible in Catalog)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#5C6E42] focus:ring-[#8B9B6D]"
            />
            <span className="font-semibold">Featured on Homepage</span>
          </label>
        </div>
      </div>

      {/* Markdown Content & Lists */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          3. Detailed Curriculum Architecture & Outcomes
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Key Highlights (One per line)
          </label>
          <textarea
            rows={3}
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            placeholder="e.g. 4 PDF-First Architectural Manuals&#10;Lifetime access&#10;Spreadsheet pro formas"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-800 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            What You Will Learn (One per line)
          </label>
          <textarea
            rows={4}
            value={learnText}
            onChange={(e) => setLearnText(e.target.value)}
            placeholder="e.g. Master household cashflow velocity&#10;Underwrite commercial debt covenants"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-800 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Requirements / Prerequisites (One per line)
          </label>
          <textarea
            rows={3}
            value={reqText}
            onChange={(e) => setReqText(e.target.value)}
            placeholder="e.g. Basic personal accounting knowledge&#10;Spreadsheet application"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-800 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Course Description (Markdown Supported)
          </label>
          <textarea
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive description..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-800 focus:bg-white focus:border-[#5C6E42] focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}
