"use client";

import React, { useState } from "react";
import {
  Coins,
  Plus,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Layers,
  Check,
  X,
  AlertCircle,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export interface AdminCreditPackage {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  credits: number;
  bonusCredits: number;
  price: number;
  priceGbp: number | null;
  currency: string;
  badge: string | null;
  popular: boolean;
  features: string[];
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCreditPackagesManager({
  initialPackages,
}: {
  initialPackages: AdminCreditPackage[];
}) {
  const [packages, setPackages] = useState<AdminCreditPackage[]>(initialPackages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<AdminCreditPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCredits, setFormCredits] = useState<number>(50);
  const [formBonusCredits, setFormBonusCredits] = useState<number>(0);
  const [formPrice, setFormPrice] = useState<number>(49);
  const [formPriceGbp, setFormPriceGbp] = useState<number | "">("");
  const [formBadge, setFormBadge] = useState("");
  const [formPopular, setFormPopular] = useState(false);
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [formOrder, setFormOrder] = useState<number>(0);
  const [formPublished, setFormPublished] = useState(true);

  const resetForm = () => {
    setEditingPackage(null);
    setFormName("");
    setFormTagline("");
    setFormDescription("");
    setFormCredits(50);
    setFormBonusCredits(0);
    setFormPrice(49);
    setFormPriceGbp("");
    setFormBadge("");
    setFormPopular(false);
    setFormFeatures([]);
    setNewFeatureInput("");
    setFormOrder(packages.length + 1);
    setFormPublished(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: AdminCreditPackage) => {
    setEditingPackage(pkg);
    setFormName(pkg.name);
    setFormTagline(pkg.tagline || "");
    setFormDescription(pkg.description || "");
    setFormCredits(pkg.credits);
    setFormBonusCredits(pkg.bonusCredits);
    setFormPrice(pkg.price);
    setFormPriceGbp(pkg.priceGbp !== null && pkg.priceGbp !== undefined ? pkg.priceGbp : "");
    setFormBadge(pkg.badge || "");
    setFormPopular(pkg.popular);
    setFormFeatures([...(pkg.features || [])]);
    setNewFeatureInput("");
    setFormOrder(pkg.order);
    setFormPublished(pkg.published);
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFormFeatures([...formFeatures, newFeatureInput.trim()]);
      setNewFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormFeatures(formFeatures.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formCredits <= 0 || formPrice <= 0) {
      toast.error("Please provide a valid package name, credits, and price.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(
      editingPackage ? "Updating package..." : "Creating package..."
    );

    const payload = {
      name: formName.trim(),
      tagline: formTagline.trim() || null,
      description: formDescription.trim() || null,
      credits: Number(formCredits),
      bonusCredits: Number(formBonusCredits) || 0,
      price: Number(formPrice),
      priceGbp: formPriceGbp !== "" ? Number(formPriceGbp) : null,
      badge: formBadge.trim() || null,
      popular: formPopular,
      features: formFeatures,
      order: Number(formOrder) || 0,
      published: formPublished,
    };

    try {
      const url = editingPackage
        ? `/api/admin/credit-packages/${editingPackage.id}`
        : "/api/admin/credit-packages";
      const method = editingPackage ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save credit package");
      }

      if (editingPackage) {
        setPackages((prev) =>
          prev.map((p) => (p.id === editingPackage.id ? data.package : p))
        );
        toast.success("Credit package updated successfully", { id: toastId });
      } else {
        setPackages((prev) => [...prev, data.package]);
        toast.success("New credit package created", { id: toastId });
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting package...");
    try {
      const res = await fetch(`/api/admin/credit-packages/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete package");

      setPackages((prev) => prev.filter((p) => p.id !== id));
      toast.success("Credit package deleted", { id: toastId });
      setDeleteConfirmId(null);
    } catch (err: any) {
      toast.error(err.message || "Could not delete package", { id: toastId });
    }
  };

  const handleTogglePublish = async (pkg: AdminCreditPackage) => {
    const updated = !pkg.published;
    try {
      const res = await fetch(`/api/admin/credit-packages/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: updated }),
      });
      if (res.ok) {
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, published: updated } : p))
        );
        toast.success(
          updated ? "Package published live" : "Package unpublished (draft)"
        );
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D5DEE5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#007554] bg-[#E3FFF3] px-2.5 py-0.5 rounded-full border border-[#31F2BF]/40">
              COMMERCE & MONETIZATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1D2A36] tracking-tight">
            Credit Packages Management
          </h1>
          <p className="text-xs sm:text-sm text-[#657482] mt-1">
            Configure dynamic credit packages, bundle discounts, pricing, and live checkout availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/credits"
            target="_blank"
            className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-semibold text-[#1D2A36] shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Preview Credits Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#657482]" />
          </Link>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-white font-extrabold text-xs shadow-xs hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-[#132030]"
          >
            <Plus className="w-4 h-4 text-[#31F2BF]" />
            <span>New Package</span>
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#D5DEE5] shadow-xs">
          <div className="flex items-center justify-between text-[#657482] text-xs font-medium">
            <span>Total Packages</span>
            <Coins className="w-4 h-4 text-[#1D2A36]" />
          </div>
          <p className="text-2xl font-black text-[#1D2A36] mt-2 font-mono">
            {packages.length}
          </p>
          <p className="text-[11px] text-[#8995A1] mt-0.5">In catalog</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D5DEE5] shadow-xs">
          <div className="flex items-center justify-between text-[#657482] text-xs font-medium">
            <span>Active Live</span>
            <CheckCircle2 className="w-4 h-4 text-[#007554]" />
          </div>
          <p className="text-2xl font-black text-[#007554] mt-2 font-mono">
            {packages.filter((p) => p.published).length}
          </p>
          <p className="text-[11px] text-[#8995A1] mt-0.5">Purchasable by students</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D5DEE5] shadow-xs">
          <div className="flex items-center justify-between text-[#657482] text-xs font-medium">
            <span>Popular Highlight</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2 font-mono">
            {packages.filter((p) => p.popular).length}
          </p>
          <p className="text-[11px] text-[#8995A1] mt-0.5">Featured badges</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D5DEE5] shadow-xs">
          <div className="flex items-center justify-between text-[#657482] text-xs font-medium">
            <span>Credit Range</span>
            <Layers className="w-4 h-4 text-[#31F2BF]" />
          </div>
          <p className="text-2xl font-black text-[#1D2A36] mt-2 font-mono">
            {packages.length > 0
              ? `${Math.min(...packages.map((p) => p.credits + p.bonusCredits))} - ${Math.max(
                  ...packages.map((p) => p.credits + p.bonusCredits)
                )}`
              : "0"}
          </p>
          <p className="text-[11px] text-[#8995A1] mt-0.5">Credits per bundle</p>
        </div>
      </div>

      {/* Packages Table Card */}
      <div className="rounded-xl bg-white border border-[#D5DEE5] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#EDF1F5] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1D2A36] tracking-tight">
            Configured Credit Packages
          </h2>
          <span className="text-xs font-mono text-[#8995A1]">
            Ordered by priority ({packages.length} items)
          </span>
        </div>

        {packages.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Coins className="w-10 h-10 text-[#8995A1] mx-auto" />
            <h3 className="text-sm font-bold text-[#1D2A36]">No credit packages created yet</h3>
            <p className="text-xs text-[#657482] max-w-sm mx-auto">
              Create your first package so students can buy credits and unlock courses on checkout.
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-lg bg-[#1D2A36] text-white text-xs font-bold hover:bg-[#132030]"
            >
              Create Package
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDF1F5] text-[10px] uppercase font-mono text-[#8995A1] bg-[#F5F8FA]">
                  <th className="py-3.5 px-4 font-semibold">Order</th>
                  <th className="py-3.5 px-4 font-semibold">Package Name & Tagline</th>
                  <th className="py-3.5 px-4 font-semibold">Credits Breakdown</th>
                  <th className="py-3.5 px-4 font-semibold">Price (EUR / GBP)</th>
                  <th className="py-3.5 px-4 font-semibold">Badge</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1F5]">
                {packages.map((pkg) => {
                  const totalCredits = pkg.credits + pkg.bonusCredits;
                  return (
                    <tr
                      key={pkg.id}
                      className="hover:bg-[#F5F8FA]/70 transition-colors"
                    >
                      <td className="py-4 px-4 font-mono text-[#8995A1]">
                        #{pkg.order}
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1D2A36] text-sm">
                              {pkg.name}
                            </span>
                            {pkg.popular && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#132030] text-[#31F2BF] border border-[#31F2BF]/30">
                                Popular
                              </span>
                            )}
                          </div>
                          {pkg.tagline && (
                            <p className="text-[11px] text-[#657482] line-clamp-1">
                              {pkg.tagline}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-[#1D2A36] font-mono">
                              {totalCredits}
                            </span>
                            <span className="text-xs font-bold text-[#007554]">
                              Credits
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#8995A1] block">
                            {pkg.credits} Base {pkg.bonusCredits > 0 ? `+ ${pkg.bonusCredits} Bonus` : ""}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5 font-mono">
                          <span className="text-sm font-bold text-[#1D2A36] block">
                            €{pkg.price}
                          </span>
                          {pkg.priceGbp && (
                            <span className="text-[11px] text-[#657482] block">
                              £{pkg.priceGbp}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {pkg.badge ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/40">
                            {pkg.badge}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#8995A1]">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(pkg)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                            pkg.published
                              ? "bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/40"
                              : "bg-[#F5F8FA] text-[#8995A1] border border-[#D5DEE5]"
                          }`}
                        >
                          {pkg.published ? (
                            <>
                              <Eye className="w-3 h-3 text-[#007554]" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-[#8995A1]" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/checkout/credits/${pkg.id}`}
                            target="_blank"
                            title="Test checkout page"
                            className="p-1.5 rounded-lg hover:bg-[#EDF1F5] text-[#657482] hover:text-[#1D2A36] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => openEditModal(pkg)}
                            title="Edit package"
                            className="p-1.5 rounded-lg hover:bg-[#EDF1F5] text-[#1D2A36] transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === pkg.id ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(pkg.id)}
                                className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 rounded bg-[#EDF1F5] text-[#1D2A36] text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(pkg.id)}
                              title="Delete package"
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#D5DEE5] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EDF1F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E3FFF3] border border-[#31F2BF]/40 flex items-center justify-center text-[#007554]">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1D2A36]">
                    {editingPackage ? "Edit Credit Package" : "Create Credit Package"}
                  </h3>
                  <p className="text-xs text-[#657482]">
                    Specify credits, bonus allocation, pricing, and key marketing bullet points.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-[#8995A1] hover:text-[#1D2A36] hover:bg-[#F5F8FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="font-bold text-[#1D2A36] block">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Quantitative Pro"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                  />
                </div>

                {/* Badge */}
                <div className="space-y-1">
                  <label className="font-bold text-[#1D2A36] block">
                    Pill Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. Most Popular • Save 35%"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="font-bold text-[#1D2A36] block">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="e.g. High-yield access to quantitative engines and labs"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                />
              </div>

              {/* Credits & Bonus */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#1D2A36] block">
                    Base Credits *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formCredits}
                    onChange={(e) => setFormCredits(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-mono text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1D2A36] block">
                    Bonus Credits
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formBonusCredits}
                    onChange={(e) => setFormBonusCredits(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-mono text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1D2A36] block">
                    Total Delivered
                  </label>
                  <div className="w-full px-3.5 py-2.5 rounded-lg bg-[#EDF1F5] border border-[#D5DEE5] text-xs font-mono font-black text-[#007554]">
                    {Number(formCredits || 0) + Number(formBonusCredits || 0)} Credits
                  </div>
                </div>
              </div>

              {/* Pricing (EUR & GBP) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#1D2A36] block">
                    EUR Price (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={1}
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-mono text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1D2A36] block">
                    GBP Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={1}
                    value={formPriceGbp}
                    onChange={(e) =>
                      setFormPriceGbp(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="Auto or optional override"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-mono text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1D2A36] block">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-mono text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                  />
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <label className="font-bold text-[#1D2A36] block">
                  Package Key Highlights / Deliverables
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g. Unlocks 4-5 complete master courses"
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2.5 rounded-lg bg-[#1D2A36] text-white font-bold text-xs hover:bg-[#132030] cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {formFeatures.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {formFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs"
                      >
                        <span className="flex items-center gap-2 text-[#1D2A36]">
                          <Check className="w-3.5 h-3.5 text-[#007554]" />
                          {feat}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-[#8995A1] hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#EDF1F5]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPopular}
                    onChange={(e) => setFormPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1D2A36] accent-[#1D2A36]"
                  />
                  <span className="font-bold text-[#1D2A36]">
                    Mark as &quot;Most Popular&quot;
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007554] accent-[#007554]"
                  />
                  <span className="font-bold text-[#1D2A36]">
                    Published (Live for purchase)
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDF1F5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-[#D5DEE5] text-[#657482] hover:bg-[#F5F8FA] font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-white font-extrabold text-xs shadow-xs hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-[#132030] disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-[#31F2BF]" />
                  <span>{editingPackage ? "Save Changes" : "Create Package"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

