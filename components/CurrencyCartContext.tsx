"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "EUR" | "GBP";

export interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: number; // in EUR
  creditsCost?: number;
  duration: string;
  coverImage?: string | null;
}

interface CurrencyCartContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (eurAmount: number) => string;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  isInCart: (id: string) => boolean;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  totalEur: number;
  totalCredits: number;
  // Credits system integration
  userCredits: number | null;
  setUserCredits: React.Dispatch<React.SetStateAction<number | null>>;
  isCreditsModalOpen: boolean;
  setIsCreditsModalOpen: (open: boolean) => void;
  refreshCredits: () => Promise<void>;
}

const CurrencyCartContext = createContext<CurrencyCartContextType | undefined>(
  undefined
);

// Exchange rate approx: 1 EUR = 0.85 GBP
const GBP_RATE = 0.85;

export function CurrencyCartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);

  // Fetch user credit balance
  const refreshCredits = async () => {
    try {
      const res = await fetch("/api/credits/balance");
      const data = await res.json();
      if (data.authenticated) {
        setUserCredits(data.credits);
      } else {
        setUserCredits(null);
      }
    } catch {
      setUserCredits(null);
    }
  };

  // Load from localStorage and fetch credits on client mount
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem("finskool_currency") as
        | Currency
        | null;
      if (savedCurrency === "EUR" || savedCurrency === "GBP") {
        setCurrencyState(savedCurrency);
      }

      const savedCart = localStorage.getItem("finskool_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error("Cart storage error:", err);
    }

    refreshCredits();
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("finskool_currency", c);
    } catch {}
  };

  const isInCart = (id: string) => cart.some((i) => i.id === id);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      const updated = [...prev, item];
      try {
        localStorage.setItem("finskool_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem("finskool_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("finskool_cart");
    } catch {}
  };

  const formatPrice = (eurAmount: number) => {
    if (currency === "GBP") {
      const gbpAmount = Math.round(eurAmount * GBP_RATE);
      return `£${gbpAmount}`;
    }
    return `€${eurAmount}`;
  };

  const totalEur = cart.reduce((sum, item) => sum + item.price, 0);
  const totalCredits = cart.reduce(
    (sum, item) => sum + (item.creditsCost || Math.round(item.price / 10)),
    0
  );

  return (
    <CurrencyCartContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        cart,
        addToCart,
        removeFromCart,
        isInCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount: cart.length,
        totalEur,
        totalCredits,
        userCredits,
        setUserCredits,
        isCreditsModalOpen,
        setIsCreditsModalOpen,
        refreshCredits,
      }}
    >
      {children}
    </CurrencyCartContext.Provider>
  );
}

export function useCurrencyCart() {
  const context = useContext(CurrencyCartContext);
  if (!context) {
    throw new Error(
      "useCurrencyCart must be used within a CurrencyCartProvider"
    );
  }
  return context;
}
