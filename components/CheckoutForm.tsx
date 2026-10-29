"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Building,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrencyCart } from "./CurrencyCartContext";

interface CourseData {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  duration: string;
  coverImage: string | null;
  lessons: { slug: string }[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function CheckoutForm({
  course,
  user,
}: {
  course: CourseData;
  user: UserData | null;
}) {
  const router = useRouter();
  const { formatPrice, currency } = useCurrencyCart();

  // Auth fields (for guests)
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "BANK_WIRE" | "SEPA">("CARD");

  // Card Inputs
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("889");
  const [cardName, setCardName] = useState(user ? user.name : "Alexander Hayes");

  // Bank Wire Inputs
  const [bankName, setBankName] = useState("Barclays Private Banking");
  const [iban, setIban] = useState("GB82 BARC 2004 1584 9281 90");
  const [swift, setSwift] = useState("BARCGB22");

  // Address Inputs
  const [country, setCountry] = useState("United Kingdom");
  const [city, setCity] = useState("London");
  const [postalCode, setPostalCode] = useState("EC2A 4NE");

  // Submission / Animation States
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Auto-fill test values
  const handleAutofill = () => {
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("08/29");
    setCardCvc("772");
    setCardName(user?.name || "Marcus Vance");
    toast.success("Auto-filled mock test banking credentials!");
  };

  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const toastId = toast.loading("Authorizing mock banking connection...");

    try {
      setLoadingStep("Authorizing mock banking connection...");
      await new Promise((res) => setTimeout(res, 500));

      setLoadingStep("Provisioning student license & cryptographic key...");
      toast.loading("Provisioning student license & cryptographic key...", { id: toastId });
      await new Promise((res) => setTimeout(res, 500));

      setLoadingStep("Unlocking course field manuals & simulator access...");
      toast.loading("Unlocking course field manuals & simulator access...", { id: toastId });

      const billingDetails = {
        paymentMethod,
        cardLast4: paymentMethod === "CARD" ? cardNumber.slice(-4) : undefined,
        ibanLast4: paymentMethod !== "CARD" ? iban.slice(-4) : undefined,
        country,
        city,
        postalCode,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: course.slug,
          paymentMethod: `MOCK_${paymentMethod}`,
          billingDetails,
          name: user ? undefined : guestName,
          email: user ? undefined : guestEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete checkout");
      }

      setLoadingStep("Success! Redirecting to course player...");
      toast.success("License granted! Directing to course curriculum...", { id: toastId });
      await new Promise((res) => setTimeout(res, 500));

      router.push(data.redirectUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      toast.error(err.message || "Checkout failed", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleProcessCheckout} className="space-y-6">
      {/* Guest Account Info (if not logged in) */}
      {!user && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#1C2417] uppercase tracking-wider">
              1. Student Identity (Instant Access)
            </h3>
            <span className="text-[10px] font-mono font-bold text-[#384524] bg-[#8B9B6D]/15 border border-[#8B9B6D]/30 px-2 py-0.5 rounded-full">Instant Provisioning</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C2417] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Julian Knight"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F2EB]/50 border border-[#EBE2D6] text-xs text-[#1C2417] placeholder-[#4A5836]/50 focus:border-[#5C6E42] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C2417] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="e.g. operator@financialskool.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F2EB]/50 border border-[#EBE2D6] text-xs text-[#1C2417] placeholder-[#4A5836]/50 focus:border-[#5C6E42] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selector */}
      <div className="p-6 rounded-3xl bg-white border border-[#EBE2D6] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#1C2417] uppercase tracking-wider">
            {user ? "1." : "2."} Mock Payment Instrument
          </h3>
          <button
            type="button"
            onClick={handleAutofill}
            className="text-[11px] font-mono font-bold text-[#384524] hover:text-[#1C2417] flex items-center gap-1 cursor-pointer bg-[#8B9B6D]/15 px-2.5 py-1 rounded-full border border-[#8B9B6D]/30"
          >
            <Sparkles className="w-3 h-3 text-[#5C6E42]" />
            Auto-fill Test Details
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-[#F7F2EB] border border-[#EBE2D6]">
          <button
            type="button"
            onClick={() => setPaymentMethod("CARD")}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              paymentMethod === "CARD"
                ? "bg-white text-[#2E3C1B] shadow-xs"
                : "text-[#4A5836] hover:text-[#1C2417]"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Credit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("BANK_WIRE")}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              paymentMethod === "BANK_WIRE"
                ? "bg-white text-[#2E3C1B] shadow-xs"
                : "text-[#4A5836] hover:text-[#1C2417]"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Bank Wire
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("SEPA")}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              paymentMethod === "SEPA"
                ? "bg-white text-[#2E3C1B] shadow-xs"
                : "text-[#4A5836] hover:text-[#1C2417]"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            SEPA Instant
          </button>
        </div>

        {/* CARD INPUTS */}
        {paymentMethod === "CARD" && (
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:border-[#5C6E42] focus:outline-none tracking-widest"
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:border-[#5C6E42] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CVC / CVV
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="•••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:border-[#5C6E42] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Full Name as on card"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:border-[#5C6E42] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* BANK WIRE INPUTS */}
        {paymentMethod === "BANK_WIRE" && (
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Originating Financial Institution
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Barclays, UBS, HSBC"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:border-[#5C6E42] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                IBAN / Account Number
              </label>
              <input
                type="text"
                required
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="GB82 BARC ..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:border-[#5C6E42] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                BIC / SWIFT Code
              </label>
              <input
                type="text"
                required
                value={swift}
                onChange={(e) => setSwift(e.target.value)}
                placeholder="BARCGB22"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:border-[#5C6E42] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* SEPA INPUTS */}
        {paymentMethod === "SEPA" && (
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                European Bank IBAN
              </label>
              <input
                type="text"
                required
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="DE89 3704 ..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:border-[#5C6E42] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="First and Last Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:border-[#5C6E42] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Billing Address Details */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          {user ? "2." : "3."} Billing Jurisdiction
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-[#5C6E42] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-[#5C6E42] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:border-[#5C6E42] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Complete Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-full bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#8B9B6D]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {loadingStep}
          </span>
        ) : (
          <>
            Complete Mock Transaction & Unlock License ({formatPrice(course.price)})
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Trust Notice */}
      <div className="text-center text-[11px] text-slate-500 font-mono space-y-1">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          Mock Educational Environment • No Actual Real-World Charges Billed
        </p>
        <p>Instant Dashboard Activation upon submission.</p>
      </div>
    </form>
  );
}
