export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  bonusCredits: number;
  totalCredits: number;
  price: number; // EUR price
  priceGbp: number; // GBP price
  badge?: string;
  popular?: boolean;
  tagline: string;
  description: string;
  features: string[];
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "pkg_starter",
    name: "Starter Pack",
    credits: 50,
    bonusCredits: 5,
    totalCredits: 55,
    price: 49,
    priceGbp: 42,
    badge: "2 Full Courses",
    tagline: "Essential foundations for personal finance operators",
    description: "Ideal for unlocking 2 fundamental PDF-first playbooks with models.",
    features: [
      "55 Total Course Credits",
      "Unlock 2 full master courses",
      "Lifetime playbook downloads",
      "Instant mock provisioning",
    ],
  },
  {
    id: "pkg_growth",
    name: "Quantitative Pro",
    credits: 120,
    bonusCredits: 25,
    totalCredits: 145,
    price: 99,
    priceGbp: 85,
    popular: true,
    badge: "Most Popular • Save 35%",
    tagline: "High-yield access to quantitative engines and labs",
    description: "Best choice for serious students building dynamic cashflow architecture.",
    features: [
      "145 Total Course Credits (+25 Bonus)",
      "Unlock 4-5 complete courses",
      "Full access to risk simulator scenarios",
      "Priority curriculum updates",
    ],
  },
  {
    id: "pkg_master",
    name: "Institutional Master",
    credits: 280,
    bonusCredits: 70,
    totalCredits: 350,
    price: 199,
    priceGbp: 170,
    badge: "Complete Curriculum",
    tagline: "All current and upcoming institutional doctrine",
    description: "Sufficient credits to unlock every course in the academy plus upcoming drops.",
    features: [
      "350 Total Course Credits (+70 Bonus)",
      "Unlocks entire current curriculum",
      "Credits never expire",
      "Institutional verification certificate",
    ],
  },
  {
    id: "pkg_enterprise",
    name: "Syndicate / Firm",
    credits: 600,
    bonusCredits: 200,
    totalCredits: 800,
    price: 399,
    priceGbp: 340,
    badge: "Multi-Operator",
    tagline: "Massive scale for teams and trading syndicates",
    description: "Maximum efficiency credit pool for family offices and trading partnerships.",
    features: [
      "800 Total Course Credits (+200 Bonus)",
      "Unlimited lifetime access across all labs",
      "Downloadable Excel underwriting macros",
      "Direct curriculum advisor access",
    ],
  },
];

/**
 * Calculates credit cost from course price.
 * Default standard: 1 Credit ≈ €10 value (e.g. €249 -> 25 Credits, €499 -> 50 Credits).
 */
export function calculateCreditCost(priceEur: number): number {
  if (priceEur <= 0) return 0;
  return Math.max(10, Math.round(priceEur / 10));
}

