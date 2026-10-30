"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Building,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Coins,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrencyCart } from "./CurrencyCartContext";

export interface CreditCheckoutPackage {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  credits: number;
  bonusCredits: number;
  price: number;
  priceGbp: number | null;
  currency: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function CreditCheckoutForm({
  pkg,
  user,
}: {
  pkg: CreditCheckoutPackage;
  user: UserData | null;
}) {
  const router = useRouter();
  const { currency, setCurrency, refreshCredits } = useCurrencyCart();

  // Auth fields (for guests)
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPassword, setGuestPassword] = useState("");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "BANK_WIRE">("CARD");

  // Card Inputs
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("889");
  const [cardName, setCardName] = useState(user ? user.name : "Alexander Hayes");

  // Address Inputs
  const [country, setCountry] = useState("United Kingdom");
  const [city, setCity] = useState("London");
  const [postalCode, setPostalCode] = useState("EC2A 4NE");

  const [loading, setLoading] = useState(false);

  const totalCredits = pkg.credits + pkg.bonusCredits;
  const activePrice =
    currency === "GBP" && pkg.priceGbp ? pkg.priceGbp : pkg.price;
  const currencySymbol = currency === "GBP" ? "£" : "€";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user && (!guestEmail || !guestName)) {
      toast.error("Please provide your name and email to receive your credits.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing credit package acquisition...");

    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.id,
          paymentMethod: paymentMethod === "CARD" ? "MOCK_CARD" : "MOCK_BANK_WIRE",
          currency,
          email: user ? user.email : guestEmail,
          name: user ? user.name : guestName,
          password: guestPassword || "FinSkool@2026!",
          billingDetails: JSON.stringify({
            cardName,
            country,
            city,
            postalCode,
          }),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to complete credit purchase");
      }

      await refreshCredits();

      toast.success(
        `Success! +${totalCredits} Credits added to your account wallet.`,
        { id: toastId }
      );

      router.push("/student/credits?acquired=true");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Purchase failed. Please try again.", {
        id: toastId,
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Account Section */}
      <div className="p-6 sm:p-7 rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#657482]">
            1. Student Wallet Account
          </span>
          {user ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E3FFF3] text-[#007554] text-[10px] font-mono font-bold border border-[#31F2BF]/40">
              <UserCheck className="w-3 h-3" />
              Authenticated Operator
            </span>
          ) : (
            <span className="text-[10px] font-mono text-[#8995A1]">
              Instant Account Creation
            </span>
          )}
        </div>

        {user ? (
          <div className="p-4 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-[#1D2A36]">{user.name}</p>
              <p className="text-[#657482] font-mono text-[11px]">{user.email}</p>
            </div>
            <span className="text-[10px] font-mono text-[#007554] font-bold">
              Credits credited to this ID
            </span>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#1D2A36] mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Alexander Hayes"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1D2A36] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="alexander@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1D2A36] mb-1">
                Account Password (Optional)
              </label>
              <input
                type="password"
                value={guestPassword}
                onChange={(e) => setGuestPassword(e.target.value)}
                placeholder="Leave blank for secure auto-generated pass"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Currency Selector */}
      <div className="p-6 sm:p-7 rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#657482]">
            2. Preferred Billing Currency
          </span>
          <span className="text-[10px] font-mono text-[#8995A1]">
            Standardized Pricing
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCurrency("EUR")}
            className={`p-3.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
              currency === "EUR"
                ? "bg-[#132030] border-[#132030] text-white shadow-xs font-bold"
                : "bg-white border-[#D5DEE5] text-[#1D2A36] hover:bg-[#F5F8FA]"
            }`}
          >
            <span>Euro (€ EUR)</span>
            <span className="font-bold">€{pkg.price}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrency("GBP")}
            className={`p-3.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
              currency === "GBP"
                ? "bg-[#132030] border-[#132030] text-white shadow-xs font-bold"
                : "bg-white border-[#D5DEE5] text-[#1D2A36] hover:bg-[#F5F8FA]"
            }`}
          >
            <span>British Pound (£ GBP)</span>
            <span className="font-bold">
              £{pkg.priceGbp || Math.round(pkg.price * 0.85)}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Payment Method */}
      <div className="p-6 sm:p-7 rounded-xl bg-white border border-[#D5DEE5] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#657482]">
            3. Instant Payment Method
          </span>
          <span className="text-[10px] font-mono text-[#007554] flex items-center gap-1 font-bold">
            <Lock className="w-3 h-3" />
            256-Bit SSL Encrypted
          </span>
        </div>

        {/* Payment Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5]">
          <button
            type="button"
            onClick={() => setPaymentMethod("CARD")}
            className={`py-2.5 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              paymentMethod === "CARD"
                ? "bg-white text-[#1D2A36] shadow-xs border border-[#D5DEE5]"
                : "text-[#657482] hover:text-[#1D2A36]"
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#007554]" />
            <span>Card Checkout</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("BANK_WIRE")}
            className={`py-2.5 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              paymentMethod === "BANK_WIRE"
                ? "bg-white text-[#1D2A36] shadow-xs border border-[#D5DEE5]"
                : "text-[#657482] hover:text-[#1D2A36]"
            }`}
          >
            <Building className="w-4 h-4 text-[#007554]" />
            <span>SEPA / Wire</span>
          </button>
        </div>

        {/* Tab 1: Credit Card */}
        {paymentMethod === "CARD" && (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#1D2A36] mb-1">
                Name on Card
              </label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Alexander Hayes"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1D2A36] mb-1">
                Card Number (Pre-filled Sandbox)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-mono text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none tracking-wider"
                />
                <span className="absolute right-3 top-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E3FFF3] text-[#007554] border border-[#31F2BF]/30">
                  TEST READY
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#1D2A36] mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-mono text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1D2A36] mb-1">
                  CVC / CVV
                </label>
                <input
                  type="text"
                  required
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="CVC"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs font-mono text-[#1D2A36] focus:bg-white focus:border-[#1D2A36] focus:outline-none text-center"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bank Wire */}
        {paymentMethod === "BANK_WIRE" && (
          <div className="p-4 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] space-y-2 text-xs">
            <span className="font-bold text-[#1D2A36] block font-mono">
              Direct Clearing Institution
            </span>
            <div className="space-y-1 font-mono text-[11px] text-[#657482]">
              <p>Bank: <strong className="text-[#1D2A36]">Barclays Private Banking UK</strong></p>
              <p>IBAN: <strong className="text-[#1D2A36]">GB82 BARC 2004 1584 9281 90</strong></p>
              <p>BIC/SWIFT: <strong className="text-[#1D2A36]">BARCGB22</strong></p>
              <p>Reference: <strong className="text-[#007554]">FS-CR-{pkg.id.toUpperCase()}</strong></p>
            </div>
            <p className="text-[11px] text-[#8995A1] pt-1">
              Sandbox mode: Click confirm to simulate instant clearing and allocate credits.
            </p>
          </div>
        )}

        {/* Address */}
        <div className="pt-2 border-t border-[#EDF1F5] space-y-3 text-xs">
          <span className="font-bold text-[#1D2A36] block">
            Billing Jurisdiction
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="w-full px-3 py-2 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36]"
              />
            </div>
            <div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full px-3 py-2 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36]"
              />
            </div>
            <div>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postcode"
                className="w-full px-3 py-2 rounded-lg bg-[#F5F8FA] border border-[#D5DEE5] text-xs text-[#1D2A36]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Complete Order Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-[#1D2A36] hover:bg-[#132030] text-white font-extrabold text-sm sm:text-base shadow-md hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-[#132030] disabled:opacity-50"
      >
        <Coins className="w-5 h-5 text-[#31F2BF]" />
        <span>
          {loading
            ? "Securing Transaction..."
            : `Confirm & Allocate ${totalCredits} Credits • ${currencySymbol}${activePrice}`}
        </span>
        <ArrowRight className="w-4 h-4 text-[#31F2BF]" />
      </button>

      <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-[#8995A1] pt-1">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#007554]" />
          Instant Balance Update
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#007554]" />
          Credits Never Expire
        </span>
      </div>
    </form>
  );
}

