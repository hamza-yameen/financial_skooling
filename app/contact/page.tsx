"use client";

import React, { useState } from "react";
import {
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  MessageSquare,
  MapPin,
  Phone,
  Globe,
  Lock,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background ambient blooms */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[450px] bg-[#8B9B6D]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B9B6D]/10 border border-[#8B9B6D]/30 text-xs font-mono font-bold text-[#384524] uppercase tracking-widest shadow-xs">
            <Mail className="w-3.5 h-3.5 text-[#5C6E42]" />
            COMMUNICATIONS & OPERATIONAL DESK
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1C2417]">
            Contact Support & <span className="text-gradient-primary">Inquiries</span>
          </h1>
          <p className="text-base text-[#4A5836] leading-relaxed font-medium">
            Need assistance with program downloads, account access, or enterprise billing? We respond
            promptly during active desk hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Support Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-[#EBE2D6] shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1C2417]">Inquiry Received</h3>
                  <p className="text-xs text-[#4A5836] max-w-sm mx-auto font-medium">
                    Your ticket has been dispatched to our operational team. A senior strategist
                    will reply to <strong className="text-[#5C6E42] font-bold">{email}</strong> within 2 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#5C6E42] font-bold hover:underline pt-2 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-extrabold text-[#1C2417] mb-2">Submit Support Ticket</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C2417] mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F2EB]/50 border border-[#EBE2D6] text-xs text-[#1C2417] placeholder-[#4A5836]/50 focus:border-[#5C6E42] focus:ring-2 focus:ring-[#8B9B6D]/20 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1C2417] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. operator@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F2EB]/50 border border-[#EBE2D6] text-xs text-[#1C2417] placeholder-[#4A5836]/50 focus:border-[#5C6E42] focus:ring-2 focus:ring-[#8B9B6D]/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C2417] mb-1">
                      Subject / Program
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Master Program PDF Download Access"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F2EB]/50 border border-[#EBE2D6] text-xs text-[#1C2417] placeholder-[#4A5836]/50 focus:border-[#5C6E42] focus:ring-2 focus:ring-[#8B9B6D]/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C2417] mb-1">
                      Detailed Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Provide relevant transaction ID or questions..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F2EB]/50 border border-[#EBE2D6] text-xs text-[#1C2417] placeholder-[#4A5836]/50 focus:border-[#5C6E42] focus:ring-2 focus:ring-[#8B9B6D]/20 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#4A5836] via-[#5C6E42] to-[#76885A] text-white font-extrabold text-xs shadow-lg shadow-[#5C6E42]/25 hover:shadow-[#5C6E42]/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch Ticket to Support Desk
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Operational Specs & Corporate Disclosure */}
          <div className="lg:col-span-5 space-y-6">
            {/* Publisher Box */}
            <div className="p-7 rounded-3xl bg-white border border-[#EBE2D6] shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B9B6D]/15 text-[#384524] text-[10px] font-bold uppercase tracking-wider border border-[#8B9B6D]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5C6E42] animate-pulse" />
                  REGISTERED PUBLISHER
                </span>
                <span className="text-[11px] font-mono font-bold text-[#4A5836]">
                  Reg: 208928597
                </span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-[#1C2417] tracking-tight">
                  OMEGA IMPORT LTD
                </h4>
                <div className="flex items-start gap-2 text-xs text-[#4A5836] mt-2 font-medium">
                  <MapPin className="w-4 h-4 text-[#5C6E42] shrink-0 mt-0.5" />
                  <span>
                    Bulgaria, Varna Province, Aksakovo Municipality, town of Ignatievo, Postal Code 9143, 23 Sinchets Street
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EBE2D6] space-y-2 text-xs font-semibold">
                <a
                  href="tel:+359898629156"
                  className="flex items-center gap-2 text-[#1C2417] hover:text-[#5C6E42] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#8B9B6D]" />
                  <span>+359898629156</span>
                </a>
                <a
                  href="mailto:support@financialskool.com"
                  className="flex items-center gap-2 text-[#1C2417] hover:text-[#5C6E42] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#8B9B6D]" />
                  <span>support@financialskool.com</span>
                </a>
                <div className="flex items-center gap-2 text-[#384524] font-mono text-[11px] pt-1">
                  <Lock className="w-3 h-3 text-[#5C6E42]" />
                  <span>256-Bit SSL Encrypted Desk</span>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-7 rounded-3xl bg-white border border-[#EBE2D6] shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-[#1C2417] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5C6E42]" />
                Operational Desk Hours
              </h4>
              <div className="space-y-2 text-xs text-[#4A5836]">
                <p>
                  <strong className="text-[#1C2417]">Monday through Friday</strong>
                  <br />
                  09:00 — 18:00 GMT (London Time)
                </p>
                <p className="text-[#4A5836]/80">
                  Tickets submitted outside operational windows are addressed early next business morning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
