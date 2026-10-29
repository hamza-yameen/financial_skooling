import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronRight, ArrowRight, Mail } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions — Financial Skool",
  description:
    "Common inquiries regarding curriculum format, dashboard access, refund guarantees, and quantitative simulators.",
};

const faqs = [
  {
    category: "Access & Delivery",
    items: [
      {
        q: "Do I get instant access after completing checkout?",
        a: "Yes. Once your transaction is authorized, your account is immediately granted lifetime access. All PDF field manuals, spreadsheet models, and interactive tools unlock in your Student Dashboard instantly.",
      },
      {
        q: "Are the PDF manuals downloadable to my computer?",
        a: "Absolutely. Every lesson includes a prominent 'Download PDF Field Manual' button. You can store them locally on encrypted drives or print them for physical annotation.",
      },
      {
        q: "How long do I keep access to the materials?",
        a: "Perpetually. We do not expire your access or demand annual renewals. Whenever we release updated revisions of an enrolled program, you receive those updates free of charge.",
      },
    ],
  },
  {
    category: "Methodology & Course Format",
    items: [
      {
        q: "Why are courses designed as PDF manuals instead of video streams?",
        a: "Institutional wealth operators, quants, and syndicators learn and reference dense operational material through text, math, diagrams, and spreadsheets. 14 to 20-page manuals allow instantaneous searchability, side-by-side terminal placement, and zero waste of valuable time.",
      },
      {
        q: "Can I use the spreadsheets in Microsoft Excel and Google Sheets?",
        a: "Yes. All provided financial models and pro formas are supplied in standard .xlsx format, fully compatible with Google Sheets, Excel, and Apple Numbers without macro locks.",
      },
      {
        q: "Do I need coding experience for the Quant and AI labs?",
        a: "For the Systematic Markets Lab, basic familiarity with Python or mathematical notation is beneficial but not required; full vectorized code notebooks are provided. The AI Systems Lab focuses primarily on API webhooks and prompt stacks accessible to non-engineers.",
      },
    ],
  },
  {
    category: "Payments, Fulfillment & Refund Policy",
    items: [
      {
        q: "How does fulfillment and delivery work for digital playbooks?",
        a: "All purchases are digitally fulfilled immediately upon payment confirmation. You receive instant perpetual access to download the PDF field manuals and financial spreadsheets directly from your Student Dashboard.",
      },
      {
        q: "Is this a recurring subscription?",
        a: "Never. Financial Skool operates strictly on a one-time purchase basis. There are zero recurring subscription traps, membership fees, or unexpected billings.",
      },
      {
        q: "What is your satisfaction & refund policy?",
        a: "We offer an unconditional 14-day operational satisfaction guarantee. If our field manuals do not provide unprecedented clarity and technical value, simply contact support@financialskool.com for a prompt refund.",
      },
      {
        q: "Who is the registered publisher of the materials?",
        a: "All curriculum and materials are published by OMEGA IMPORT LTD (Company Reg: 208928597), located at Bulgaria, Varna Province, Aksakovo Municipality, town of Ignatievo, Postal Code 9143, 23 Sinchets Street.",
      },
      {
        q: "Do you offer personalized financial advice or broker signals?",
        a: "No. Financial Skool is strictly an educational laboratory. We do not provide individualized financial advice, manage funds, or operate as an investment broker.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background ambient blooms */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[450px] bg-[#8B9B6D]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B9B6D]/10 border border-[#8B9B6D]/30 text-xs font-mono font-bold text-[#384524] uppercase tracking-widest shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#5C6E42]" />
            KNOWLEDGE BASE & GUIDELINES
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1C2417]">
            Frequently Asked <span className="text-gradient-primary">Questions</span>
          </h1>
          <p className="text-base text-[#4A5836] leading-relaxed font-medium">
            Clear answers to common questions about our platform, PDF-first methodology, and licensing.
          </p>
        </div>

        <div className="space-y-10">
          {faqs.map((cat, idx) => (
            <div
              key={idx}
              id={idx === 0 ? "fulfillment" : idx === 2 ? "refund" : undefined}
              className="space-y-4 scroll-mt-24"
            >
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#5C6E42] font-mono">
                {cat.category}
              </h2>
              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => (
                  <details
                    key={itemIdx}
                    className="group p-6 rounded-2xl bg-white border border-[#EBE2D6] shadow-xs open:border-[#8B9B6D] transition-colors"
                  >
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-[#1C2417] list-none">
                      {item.q}
                      <ChevronRight className="w-4 h-4 text-[#8B9B6D] group-open:rotate-90 transition-transform shrink-0 ml-2" />
                    </summary>
                    <p className="text-xs text-[#4A5836] mt-3 leading-relaxed font-medium">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#F7F2EB] to-[#EBE2D6] border border-[#EBE2D6] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-[#1C2417]">Have a specific technical question?</h3>
            <p className="text-xs text-[#4A5836] mt-1 font-medium">
              Our operational team responds to student tickets within 2 business hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#5C6E42] via-[#6E8050] to-[#8B9B6D] text-white font-bold text-xs shadow-md shadow-[#5C6E42]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5" />
            Contact Support Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
