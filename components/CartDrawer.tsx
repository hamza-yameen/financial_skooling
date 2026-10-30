"use client";

import React from "react";
import Link from "next/link";
import { X, ShoppingBag, Trash2, ArrowRight, Lock, Coins } from "lucide-react";
import { useCurrencyCart } from "./CurrencyCartContext";

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    formatPrice,
    totalEur,
    userCredits,
    totalCredits,
    setIsCreditsModalOpen,
  } = useCurrencyCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-[#0C1927]/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#EDF1F5] border-l border-[#D5DEE5] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#D5DEE5] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E3FFF3] border border-[#31F2BF]/40 flex items-center justify-center text-[#007554]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-[#1D2A36] tracking-tight">
                Study Cart ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-[#657482] hover:text-[#1D2A36] hover:bg-[#F5F8FA] transition-colors cursor-pointer border border-transparent hover:border-[#D5DEE5]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#D5DEE5] flex items-center justify-center mx-auto text-[#657482]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-[#1D2A36]">Your cart is empty</p>
                  <p className="text-xs text-[#657482] max-w-xs mx-auto">
                    Explore our dynamic curriculum of PDF-first playbooks and spreadsheet models.
                  </p>
                </div>
                <Link
                  href="/courses"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex px-6 py-2.5 rounded-xl bg-[#1D2A36] hover:bg-[#132030] text-white font-bold text-xs shadow-xs transition-all hover:scale-105 active:scale-95 border border-[#132030]"
                >
                  Browse Programs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white border border-[#D5DEE5] flex items-start justify-between gap-3 shadow-xs hover:border-[#8995A1] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {item.coverImage && (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#D5DEE5]"
                        />
                      )}
                      <div className="space-y-1">
                        <Link
                          href={`/courses/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-bold text-[#1D2A36] hover:text-[#007554] line-clamp-2 leading-snug transition-colors"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[10px] font-mono text-[#657482] block">
                          {item.duration}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#1D2A36] font-mono">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-[10px] font-mono text-[#007554] bg-[#E3FFF3] border border-[#31F2BF]/40 px-2 py-0.5 rounded-full font-bold">
                            {item.creditsCost || Math.max(10, Math.round(item.price / 10))} Cr
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg text-[#657482] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer / Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#D5DEE5] bg-white space-y-4">
              {/* Credits Balance Strip */}
              <div className="p-3 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#E3FFF3] border border-[#31F2BF]/40 flex items-center justify-center text-[#007554]">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#657482] font-mono block">Your Balance</span>
                    <span className="font-bold text-[#1D2A36] font-mono">
                      {userCredits !== null ? `${userCredits} Credits` : "Loading..."}
                    </span>
                  </div>
                </div>
                <Link
                  href="/credits"
                  onClick={() => setIsCartOpen(false)}
                  className="text-[10px] font-mono font-bold text-[#007554] hover:text-[#053226] cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-[#D5DEE5]"
                >
                  + Add Credits
                </Link>
              </div>

              <div className="space-y-2 text-xs font-medium">
                <div className="flex justify-between text-[#657482]">
                  <span>Subtotal (Fiat)</span>
                  <span className="font-mono text-[#1D2A36] font-bold">{formatPrice(totalEur)}</span>
                </div>
                <div className="flex justify-between text-[#657482]">
                  <span>Subtotal (Credits)</span>
                  <span className="font-mono text-[#007554] font-bold">{totalCredits} Cr</span>
                </div>
                <div className="flex justify-between text-[#657482]">
                  <span>License Term</span>
                  <span className="font-mono text-[#007554] font-bold">Lifetime • No Subs</span>
                </div>
                <div className="pt-2 border-t border-[#D5DEE5] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#1D2A36]">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#1D2A36] font-mono block leading-none">
                      {formatPrice(totalEur)}
                    </span>
                    <span className="text-xs font-mono text-[#007554] font-bold">
                      or {totalCredits} Credits
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/checkout/${cart[0].slug}`}
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 rounded-xl bg-[#1D2A36] hover:bg-[#132030] text-white font-extrabold text-sm shadow-md shadow-[#1D2A36]/15 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#132030]"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 text-[#31F2BF]" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#657482] pt-1">
                <Lock className="w-3 h-3 text-[#007554]" />
                <span>Instant 100% Mock Educational Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
