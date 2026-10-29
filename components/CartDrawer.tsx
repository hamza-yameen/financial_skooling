"use client";

import React from "react";
import Link from "next/link";
import { X, ShoppingBag, Trash2, ArrowRight, Lock } from "lucide-react";
import { useCurrencyCart } from "./CurrencyCartContext";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, formatPrice, totalEur } =
    useCurrencyCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-[#1C2417]/35 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F2EB] border-l border-[#EBE2D6] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#EBE2D6] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#8B9B6D]/15 border border-[#8B9B6D]/30 flex items-center justify-center text-[#5C6E42]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-[#1C2417] tracking-tight">
                Study Cart ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-[#7E8773] hover:text-[#1C2417] hover:bg-[#F7F2EB] transition-colors cursor-pointer border border-transparent hover:border-[#EBE2D6]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-[#EBE2D6] flex items-center justify-center mx-auto text-[#7E8773]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-[#1C2417]">Your cart is empty</p>
                  <p className="text-xs text-[#636B58] max-w-xs mx-auto">
                    Explore our dynamic curriculum of PDF-first playbooks and spreadsheet models.
                  </p>
                </div>
                <Link
                  href="/courses"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] text-white font-bold text-xs shadow-md shadow-[#8B9B6D]/30 transition-all hover:scale-105 active:scale-95"
                >
                  Browse Programs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-[#EBE2D6] flex items-start justify-between gap-3 shadow-xs hover:border-[#8B9B6D]/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {item.coverImage && (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#EBE2D6]"
                        />
                      )}
                      <div className="space-y-1">
                        <Link
                          href={`/courses/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-bold text-[#1C2417] hover:text-[#5C6E42] line-clamp-2 leading-snug transition-colors"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[10px] font-mono text-[#7E8773] block">
                          {item.duration}
                        </span>
                        <span className="text-sm font-black text-[#5C6E42] font-mono block">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg text-[#7E8773] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
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
            <div className="p-6 border-t border-[#EBE2D6] bg-white space-y-4">
              <div className="space-y-2 text-xs font-medium">
                <div className="flex justify-between text-[#636B58]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#1C2417] font-bold">{formatPrice(totalEur)}</span>
                </div>
                <div className="flex justify-between text-[#636B58]">
                  <span>License Term</span>
                  <span className="font-mono text-[#5C6E42] font-bold">Lifetime • No Subs</span>
                </div>
                <div className="pt-2 border-t border-[#EBE2D6] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#1C2417]">Total</span>
                  <span className="text-2xl font-black text-[#1C2417] font-mono">
                    {formatPrice(totalEur)}
                  </span>
                </div>
              </div>

              <Link
                href={`/checkout/${cart[0].slug}`}
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] text-white font-extrabold text-sm shadow-xl shadow-[#8B9B6D]/30 hover:shadow-[#8B9B6D]/45 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#7E8773] pt-1">
                <Lock className="w-3 h-3 text-[#5C6E42]" />
                <span>Instant 100% Mock Educational Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
