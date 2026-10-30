"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrencyCart } from "./CurrencyCartContext";

interface CourseData {
  id: string;
  title: string;
  slug: string;
  price: number;
  creditsCost?: number;
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
  const {
    formatPrice,
    userCredits,
    setIsCreditsModalOpen,
    refreshCredits,
  } = useCurrencyCart();

  const creditCost =
    course.creditsCost || Math.max(10, Math.round(course.price / 10));
  const hasEnoughCredits = userCredits !== null && userCredits >= creditCost;

  // Auth fields (for guests)
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<
    "CREDITS" | "CARD" | "BANK_WIRE" | "SEPA"
  >("CREDITS");

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
      if (paymentMethod === "CREDITS") {
        if (!hasEnoughCredits) {
          setIsCreditsModalOpen(true);
          setLoading(false);
          toast.error("Insufficient credit balance. Top up to proceed!");
          return;
        }

        setLoadingStep("Verifying student credit wallet balance...");
        toast.loading("Verifying student credit wallet balance...", { id: toastId });
        await new Promise((res) => setTimeout(res, 400));

        setLoadingStep("Deducting course credits and granting license...");
        toast.loading("Deducting course credits and granting license...", { id: toastId });
      } else {
        setLoadingStep("Authorizing mock banking connection...");
        await new Promise((res) => setTimeout(res, 400));

        setLoadingStep("Provisioning student license & cryptographic key...");
        toast.loading("Provisioning student license & cryptographic key...", { id: toastId });
        await new Promise((res) => setTimeout(res, 400));

        setLoadingStep("Unlocking course field manuals & simulator access...");
        toast.loading("Unlocking course field manuals & simulator access...", { id: toastId });
      }

      const billingDetails = {
        paymentMethod,
        cardLast4: paymentMethod === "CARD" ? cardNumber.slice(-4) : undefined,
        ibanLast4: paymentMethod === "BANK_WIRE" || paymentMethod === "SEPA" ? iban.slice(-4) : undefined,
        country,
        city,
        postalCode,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: course.slug,
          paymentMethod: paymentMethod === "CREDITS" ? "CREDITS" : `MOCK_${paymentMethod}`,
          billingDetails: paymentMethod === "CREDITS" ? undefined : billingDetails,
          name: user ? undefined : guestName,
          email: user ? undefined : guestEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete checkout");
      }

      if (paymentMethod === "CREDITS") {
        await refreshCredits();
      }

      setLoadingStep("Success! Redirecting to course player...");
      toast.success("License granted! Directing to course curriculum...", { id: toastId });
      await new Promise((res) => setTimeout(res, 500));

      router.push(data.redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "An unexpected error occurred";
      setError(msg);
      toast.error(msg, { id: toastId });
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
      <div className="p-6 rounded-2xl bg-white border border-[#D5DEE5] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#1D2A36] uppercase tracking-wider font-mono">
            {user ? "1." : "2."} Mock Payment Instrument
          </h3>
          <button
            type="button"
            onClick={handleAutofill}
            className="text-[11px] font-mono font-bold text-[#007554] hover:text-[#053226] flex items-center gap-1 cursor-pointer bg-[#E3FFF3] px-2.5 py-1 rounded-full border border-[#31F2BF]/40"
          >
            <Sparkles className="w-3 h-3 text-[#007554]" />
            Auto-fill Test Details
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5]">
          <button
            type="button"
            onClick={() => setPaymentMethod("CREDITS")}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono ${
              paymentMethod === "CREDITS"
                ? "bg-white text-[#1D2A36] shadow-xs border border-[#1D2A36]"
                : "text-[#657482] hover:text-[#1D2A36]"
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-[#007554]" />
            <span>Credits Wallet</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("CARD")}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono ${
              paymentMethod === "CARD"
                ? "bg-white text-[#1D2A36] shadow-xs border border-[#1D2A36]"
                : "text-[#657482] hover:text-[#1D2A36]"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Credit Card</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("BANK_WIRE")}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono ${
              paymentMethod === "BANK_WIRE"
                ? "bg-white text-[#1D2A36] shadow-xs border border-[#1D2A36]"
                : "text-[#657482] hover:text-[#1D2A36]"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bank Wire</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("SEPA")}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono ${
              paymentMethod === "SEPA"
                ? "bg-white text-[#1D2A36] shadow-xs border border-[#1D2A36]"
                : "text-[#657482] hover:text-[#1D2A36]"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>SEPA</span>
          </button>
        </div>

        {/* CREDITS WALLET PANEL */}
        {paymentMethod === "CREDITS" && (
          <div className="p-4 sm:p-5 rounded-xl bg-[#F5F8FA] border border-[#D5DEE5] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E3FFF3] border border-[#31F2BF]/40 flex items-center justify-center text-[#007554]">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1D2A36]">Student Credits Wallet</h4>
                  <p className="text-[10px] text-[#657482] font-mono">Instant zero-friction course unlock</p>
                </div>
              </div>
              <Link
                href="/credits"
                className="px-3 py-1 rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-white text-[10px] font-bold font-mono transition-colors cursor-pointer shadow-xs border border-[#132030]"
              >
                + Top Up Credits
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-white border border-[#D5DEE5] text-center font-mono">
              <div>
                <p className="text-[10px] text-[#657482] uppercase font-bold">Your Balance</p>
                <p className="text-base font-black text-[#1D2A36] mt-0.5">
                  {userCredits !== null ? `${userCredits} Cr` : "..."}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#657482] uppercase font-bold">Required</p>
                <p className="text-base font-black text-[#007554] mt-0.5">
                  {creditCost} Cr
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#657482] uppercase font-bold">Remaining</p>
                <p
                  className={`text-base font-black mt-0.5 ${
                    hasEnoughCredits ? "text-[#1D2A36]" : "text-rose-600"
                  }`}
                >
                  {userCredits !== null ? `${userCredits - creditCost} Cr` : "..."}
                </p>
              </div>
            </div>

            {hasEnoughCredits ? (
              <div className="flex items-center gap-2 text-xs text-[#007554] font-semibold bg-[#E3FFF3] p-2.5 rounded-xl border border-[#31F2BF]/40">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You have sufficient credit balance to unlock this course immediately!</span>
              </div>
            ) : (
              <div className="space-y-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                <p className="font-bold flex items-center gap-1.5">
                  <span>Insufficient credit balance.</span>
                  <span className="font-mono">({creditCost - (userCredits || 0)} more required)</span>
                </p>
                <Link
                  href="/credits"
                  className="w-full py-2.5 rounded-lg bg-[#1D2A36] hover:bg-[#132030] text-white font-bold text-xs transition-colors cursor-pointer block text-center border border-[#132030]"
                >
                  Purchase Credit Package Now
                </Link>
              </div>
            )}
          </div>
        )}

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
        className="w-full py-4 rounded-xl bg-[#1D2A36] hover:bg-[#132030] text-white font-extrabold text-sm shadow-md shadow-[#1D2A36]/15 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer border border-[#132030]"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {loadingStep}
          </span>
        ) : paymentMethod === "CREDITS" ? (
          <>
            <Coins className="w-4 h-4 text-[#31F2BF]" />
            <span>Confirm & Unlock Course with {creditCost} Credits</span>
            <ArrowRight className="w-4 h-4 text-[#31F2BF]" />
          </>
        ) : (
          <>
            Complete Mock Transaction & Unlock License ({formatPrice(course.price)})
            <ArrowRight className="w-4 h-4 text-[#31F2BF]" />
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
