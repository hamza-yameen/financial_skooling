process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data
  await prisma.activity.deleteMany({});
  await prisma.lessonProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPasswordAdmin = await bcrypt.hash("FinSkool@2026!", 10);
  const hashedPasswordStudent = await bcrypt.hash("FinSkool@2026!", 10);

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: "admin@finskool.com",
      password: hashedPasswordAdmin,
      name: "Marcus Vance",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      bio: "Head of Curriculum & Systems Architecture at Financial Skool. Experienced educator with 15+ years in personal wealth architecture, credit engineering, and property investment.",
    },
  });

  // 2. Create Student User
  const student = await prisma.user.create({
    data: {
      email: "student@finskool.com",
      password: hashedPasswordStudent,
      name: "Alexander Hayes",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      bio: "Financial Skool Student & Entrepreneur, building personal cashflow systems, credit stacks, and long-term financial independence.",
    },
  });

  console.log("👤 Created users:", { admin: admin.email, student: student.email });

  // 3. Create Categories
  const catWealth = await prisma.category.create({
    data: {
      name: "Wealth & Credit Architecture",
      slug: "wealth-credit",
      description: "Master household cash flows, tiered banking relationships, debt leverage mechanics, and private credit structuring.",
      icon: "TrendingUp",
      order: 1,
    },
  });

  const catRealEstate = await prisma.category.create({
    data: {
      name: "Real Estate & Asset Underwriting",
      slug: "real-estate",
      description: "Institutional property pro formas, cap rate decompression analysis, DSCR lending, and syndication waterfall modeling.",
      icon: "Building2",
      order: 2,
    },
  });

  const catQuant = await prisma.category.create({
    data: {
      name: "Systematic Markets & Quant",
      slug: "quant-markets",
      description: "Quantitative execution frameworks, edge verification, statistical distribution analysis, and drawdown control engines.",
      icon: "Cpu",
      order: 3,
    },
  });

  const catAI = await prisma.category.create({
    data: {
      name: "Digital Business & AI Systems",
      slug: "digital-business-ai",
      description: "Build decoupled cashflow assets, high-margin digital operations, autonomous customer acquisition pipelines, and AI agent workflows.",
      icon: "Zap",
      order: 4,
    },
  });

  console.log("📁 Created categories");

  // 4. Create Courses

  // Course 1: The Master Program
  const courseMaster = await prisma.course.create({
    data: {
      title: "The Financial Skool Master Program: Modern Wealth & Systems Architecture",
      slug: "master-program-wealth-systems",
      tagline: "The definitive blueprint bridging personal balance sheet optimization, real estate equity, digital income, and quantitative market mechanics.",
      summary: "A comprehensive, manual-first curriculum engineered to guide ambitious students from fundamental cashflow management to professional wealth execution. No hype, no day-trading speculation—pure practical mechanics.",
      description: `### Overview

The Financial Skool Master Program is an intensive, multi-disciplinary wealth engineering system designed for professionals, founders, and students who demand rigorous financial mechanics over social media hype.

Developed around our trademark **PDF-First Manual Architecture**, every module delivers exhaustive operating playbooks, institutional underwriting spreadsheets, cashflow waterfall diagrams, and actionable execution checklists.

### Core Architecture

- **Pillar I: Household Balance Sheet & Credit Architecture**  
  Deconstruct the distinction between income and balance-sheet velocity. Discover how tier-1 institutions evaluate debt-to-income ratios, how to engineer a pristine consumer & commercial credit stack, and how to access low-cost borrowing facilities.

- **Pillar II: Real Estate Asset Underwriting & Physical Fundamentals**  
  Transition from passive homeownership to institutional property acquisition. Learn Net Operating Income (NOI) calculation, capitalization rate variance, debt yield stress-testing, and renovation budgeting & equity creation.

- **Pillar III: Decoupled Digital Assets & Modern Cashflow Levers**  
  Build high-margin, scalable digital income engines without inventory overhang or operational drag. Implement asynchronous customer acquisition, subscription economics, and automation pipelines.

- **Pillar IV: Quantitative Market Frameworks & Risk Envelopes**  
  Understand the mathematics of liquidity, order book microstructure, and statistical edge. Eliminate emotional bias by implementing systematic risk constraints and drawdown boundaries.`,
      price: 249,
      originalPrice: 499,
      currency: "EUR",
      level: "BEGINNER",
      duration: "4 Core Modules • 56-Page Field Manuals",
      format: "PDF-First Manuals + Interactive Simulator + Dynamic Audio Guides",
      published: true,
      featured: true,
      order: 1,
      badge: "FLAGSHIP PROGRAM",
      coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
      highlights: [
        "4 Comprehensive PDF-First Architectural Manuals (14+ pages each)",
        "Lifetime access to self-paced updates with zero subscription fees",
        "Interactive Risk & Drawdown Simulator integration",
        "Complete institutional underwriting spreadsheet models (.xlsx / Google Sheets)",
        "Verified Course Completion Certificate",
      ],
      whatYouWillLearn: [
        "Structure personal and corporate cash flows using institutional treasury allocation principles",
        "Stack Tier-1 bank credit facilities and optimize commercial borrow rates without equity dilution",
        "Perform comprehensive Net Operating Income (NOI) and Debt Service Coverage Ratio (DSCR) underwriting on real estate",
        "Deploy automated digital client acquisition systems with zero ongoing operational friction",
        "Construct mathematical risk envelopes to protect and grow wealth across market cycles",
      ],
      requirements: [
        "Basic understanding of personal balance sheets and arithmetic",
        "A commitment to disciplined, rule-based execution rather than get-rich-quick speculation",
        "Spreadsheet software (Google Sheets, Microsoft Excel, or Apple Numbers)",
      ],
      categoryId: catWealth.id,
    },
  });

  // Course 1 Lessons
  const c1l1 = await prisma.lesson.create({
    data: {
      courseId: courseMaster.id,
      title: "Foundations of Wealth, Liquidity, and Credit Architecture",
      slug: "foundations-wealth-money-credit",
      moduleTitle: "Module 1: Financial Architecture & Credit Mastery",
      order: 1,
      duration: "25 min read • 14 Pages Manual",
      summary: "Household cashflow dynamics, liquidity tiers, credit stacking, debt-to-income optimization, and banking relations.",
      pdfUrl: "/api/lessons/download/module-1-wealth-credit.pdf",
      isFreePreview: true,
      content: `# Module 1: Foundations of Wealth, Liquidity, and Credit Architecture

## 1. The Core Paradigm: Wealth Velocity vs Gross Income
Most individuals evaluate their economic health using top-line income. Sophisticated wealth builders look at **cashflow velocity**, **interest efficiency**, and **tax-advantaged liquidity buffers**.

High gross income coupled with high personal burn creates fragility. Wealth architecture demands converting operational income into self-sustaining asset reserves with predictable yield and long-term upside.

---

## 2. The Three-Tier Liquidity Reservoir Model
To insulate your balance sheet against macroeconomic contractions and opportunistic asset purchases, establish three distinct liquidity tiers:

\`\`\`
[ Tier 1: Operational Liquidity ] -> 3-6 Months Operating Expenses in High-Yield Treasury Bills / MMF
         │
         ▼
[ Tier 2: Strategic Investment Reserve ] -> Liquid funds ready for undervalued investment opportunities
         │
         ▼
[ Tier 3: Core Multi-Generational Assets ] -> Cash-flowing Real Estate, Private Equity & Systematic Indices
\`\`\`

---

## 3. Credit Architecture & Commercial Borrowing Facilities
Debt is either a terminal drag or a high-leverage catalyst in modern finance. Understanding the difference comes down to the **Spread Principle**:
- **Consumer Drag Debt**: Borrowing cost > asset yield (Credit cards at 24%, auto loans at 9%).
- **Arbitrage Leverage**: Borrowing cost < asset cashflow yield + depreciation tax shield.

### Steps to Prime Banking Relations:
1. Maintain revolving utilization strictly below 7% across all reporting dates.
2. Establish relationship deposits with commercial credit unions and regional tier-1 banks.
3. Consistently transition personal guarantees into non-recourse or asset-backed commercial credit lines once business entity revenues exceed €100k/year.

---

## 4. Key Takeaways & Field Assignment
- Audit your personal monthly burn rate and categorize every euro into *Fixed Living*, *Emergency Reserve*, or *Growth Investments*.
- Download the **Tiered Balance Sheet Spreadsheet** attached in the asset tray.
- Target an immediate 90-day liquidity buffer before deploying funds into investment markets.`,
    },
  });

  const c1l2 = await prisma.lesson.create({
    data: {
      courseId: courseMaster.id,
      title: "Real Estate Asset Underwriting & Physical Fundamentals",
      slug: "real-estate-asset-fundamentals",
      moduleTitle: "Module 2: Real Estate Fundamentals",
      order: 2,
      duration: "30 min read • 16 Pages Manual",
      summary: "Commercial vs residential evaluation, Cap Rates, Net Operating Income, and stress-testing debt covenants.",
      pdfUrl: "/api/lessons/download/module-2-real-estate.pdf",
      isFreePreview: false,
      content: `# Module 2: Real Estate Asset Underwriting & Physical Fundamentals

## 1. The Golden Equations of Property Underwriting
Real estate value is driven by predictable mathematics, not speculative market enthusiasm. Master these four fundamental equations:

### Net Operating Income (NOI)
\`\`\`
NOI = Gross Scheduled Rent - Vacancy & Credit Losses - Operating Expenses (Taxes, Insurance, Repairs, Management)
*Note: Exclude debt service (mortgage payments) from NOI calculation.*
\`\`\`

### Capitalization Rate (Cap Rate)
\`\`\`
Cap Rate = Net Operating Income / Current Asset Purchase Price
\`\`\`

### Debt Service Coverage Ratio (DSCR)
\`\`\`
DSCR = Net Operating Income / Annual Debt Service (Principal + Interest)
*Institutional benchmark: Must exceed 1.25x for defensive resilience.*
\`\`\`

---

## 2. The Value-Add Execution Blueprint
The greatest asymmetry in physical property investing lies in **Forced Appreciation** through operational efficiencies:
1. **Gross Revenue Expansion**: Sub-metering utilities, adding storage facilities, covered parking, or premium pet fees.
2. **Expense Compression**: Renegotiating vendor contracts, appealing municipal property tax assessments, and retrofitting energy-efficient systems.
3. **Refinancing Liquidity**: Once NOI increases, the capitalization formula forces property valuation upward. You can then execute a tax-free cash-out refinance to pull equity into your next acquisition.

---

## 3. Checklist Before Submitting a Letter of Intent (LOI)
- [ ] Confirmed rent roll vs actual bank deposits for trailing 12 months (T12).
- [ ] Environmental Phase 1 audit cleared.
- [ ] Replacement reserve budget verified at minimum €500 per door annually.
- [ ] Stress-tested at 10% interest rate refinancing scenario.`,
    },
  });

  const c1l3 = await prisma.lesson.create({
    data: {
      courseId: courseMaster.id,
      title: "Digital Business Systems & Online Asset Strategies",
      slug: "digital-business-systems-online-assets",
      moduleTitle: "Module 3: Scalable Digital Operations",
      order: 3,
      duration: "28 min read • 14 Pages Manual",
      summary: "Decoupled cashflow operations, high-margin information & software architectures, and automated acquisition pipelines.",
      pdfUrl: "/api/lessons/download/module-3-digital-business.pdf",
      isFreePreview: false,
      content: `# Module 3: Digital Business Systems & Online Asset Strategies

## 1. The Asymmetric Economics of Digital Assets
Physical operations carry supply-chain bottlenecks, inventory depreciation, and geographic ceilings. Modern digital enterprises exhibit:
- **Zero Marginal Cost of Replication**: Once an institutional framework, code module, or curriculum is built, distribution to customer #1,000 costs virtually zero.
- **Global Liquidity Reach**: Unrestricted by local economic recessions.
- **High Free Cash Flow Conversion**: 70% to 90% operating margins compared to traditional manufacturing (8-15%).

---

## 2. The 4-Layer Digital Operating Architecture
\`\`\`
[ Layer 1: Inbound Authority & Proof ] -> Research whitepapers, transparent benchmarks, public case studies
              │
              ▼
[ Layer 2: Educational Conversion Engine ] -> High-value diagnostic tools, interactive simulators, playbooks
              │
              ▼
[ Layer 3: Core Transaction Core ] -> Instant digital fulfillment, frictionless checkout, automated onboarding
              │
              ▼
[ Layer 4: Post-Purchase Ascension & Retention ] -> Member lab access, algorithmic toolkits, recurring network
\`\`\`

---

## 3. Designing Autonomous Client Acquisition Funnels
Avoid reliant dependency on volatile paid advertising algorithms by building dual acquisition funnels:
1. **Algorithmic Search & Deep Technical Content**: Long-form guides solving acute, high-value queries.
2. **Programmatic Partnerships**: Direct API-level or revenue-share syndication with aligned ecosystem tools.`,
    },
  });

  const c1l4 = await prisma.lesson.create({
    data: {
      courseId: courseMaster.id,
      title: "Quantitative Market Mechanics & Algorithmic Frameworks",
      slug: "quant-market-mechanics-algo-frameworks",
      moduleTitle: "Module 4: Systematic Market Execution",
      order: 4,
      duration: "35 min read • 18 Pages Manual",
      summary: "Order book microstructure, systematic edges, risk envelope constraints, and drawdown containment mathematics.",
      pdfUrl: "/api/lessons/download/module-4-quant-mechanics.pdf",
      isFreePreview: false,
      content: `# Module 4: Quantitative Market Mechanics & Algorithmic Frameworks

## 1. The Fatal Flaw of Discretionary Trading
Discretionary traders trade emotions: fear of missing out (FOMO) at market peaks, and panic capitulation at market troughs.

Quantitative and systematic operators do not predict tomorrow's headline. Instead, they exploit **statistically repeatable anomalies** where the expected mathematical return is positive:

\`\`\`
Expected Value (EV) = (Win Probability × Average Win Size) - (Loss Probability × Average Loss Size)
\`\`\`

If \`EV ≤ 0\`, no amount of leverage or psychological grit will prevent mathematical ruin.

---

## 2. Order Book Microstructure & Liquidity Pools
Prices do not move because of trendlines. Prices move because aggressive market orders consume passive limit orders sitting in the order book.
- **Maker Liquidity**: Passive limit orders providing inventory at bid/ask spreads.
- **Taker Liquidity**: Aggressive market orders sweeping depth levels.
- **Liquidity Vacuums**: Sudden gaps where slippage amplifies loss if stop-loss mechanics are poorly designed.

---

## 3. Position Sizing & The Ruin Equation
Even with an edge yielding a 60% win rate and 1.5:1 reward-to-risk ratio, taking a 10% risk per trade yields a mathematically guaranteed probability of total drawdown over a 200-trade sequence.

### The Fractional Kelly Criterion:
\`\`\`
f* = (p(b + 1) - 1) / b
Where:
p = Win probability
b = Odds received (Reward / Risk)
\`\`\`
In professional asset management, operators apply **Quarter Kelly (0.25 × f*)** to eliminate systemic tail-risk.`,
    },
  });

  // Course 2: Systematic Markets & Quant Strategy Lab
  const courseQuant = await prisma.course.create({
    data: {
      title: "Systematic Markets & Quant Strategy Lab",
      slug: "systematic-markets-quant-lab",
      tagline: "Design, backtest, and stress-test rules-based algorithmic trading strategies with strict mathematical drawdown constraints.",
      summary: "An 8-week hands-on laboratory for data-driven investors and systematic traders. Master statistical mean reversion, momentum regimes, slippage modeling, and multi-factor position sizing.",
      description: `### Laboratory Overview

The Systematic Markets & Quant Strategy Lab is built for traders who want to eradicate subjectivity and emotional fatigue. Over 10 comprehensive lessons spanning an 8-week structured roadmap, you will construct end-to-end algorithmic market models.

### Key Laboratory Objectives

1. Formulate testable statistical hypotheses grounded in market microstructure.
2. Backtest strategies across 10+ years of high-resolution tick and minute data while eliminating look-ahead bias and curve-fitting traps.
3. Model real-world execution friction: exchange fees, maker/taker rebate economics, and market-impact slippage.
4. Integrate the Financial Skool Risk & Drawdown Engine to dynamically constrain session loss and peak-to-trough drawdowns.`,
      price: 699,
      originalPrice: 999,
      currency: "EUR",
      level: "ADVANCED",
      duration: "10 Lessons • 8 Weeks Structured Lab",
      format: "Python Code Notebooks + Quant Lab Manuals + Live Simulator Sandbox",
      published: true,
      featured: true,
      order: 2,
      badge: "ADVANCED QUANT LAB",
      coverImage: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
      highlights: [
        "10 Technical Strategy Modules with Python & Vectorized Backtesting Notebooks",
        "Proprietary Drawdown Envelope & Risk Sizing Algorithms",
        "Out-of-sample Monte Carlo permutation testing suites",
        "Private quant cohort forum access and code reviews",
        "Direct integration with the Financial Skool Risk Simulator",
      ],
      whatYouWillLearn: [
        "Construct robust mean-reversion and cross-sectional momentum trading algorithms",
        "Detect and eliminate survivorship bias, snooping bias, and overfitting in backtests",
        "Calculate Value at Risk (VaR), Conditional VaR (CVaR), and Maximum Adverse Excursion",
        "Deploy automated execution hooks with automated circuit breakers for volatile regimes",
      ],
      requirements: [
        "Completion of the Master Program or equivalent financial markets literacy",
        "Basic familiarity with Python or mathematical notation",
        "Dedication to rigorous scientific methodology over intuitive trading",
      ],
      categoryId: catQuant.id,
    },
  });

  // Course 2 Lessons
  await prisma.lesson.create({
    data: {
      courseId: courseQuant.id,
      title: "Quantitative Strategy Architecture & Statistical Hypothesis Testing",
      slug: "quant-architecture-hypothesis-testing",
      moduleTitle: "Module 1: Strategy Formulation",
      order: 1,
      duration: "40 min read • 20 Pages Lab",
      summary: "Formulating null hypotheses, p-value pitfalls in financial time series, and stationary data transformations.",
      pdfUrl: "/api/lessons/download/quant-lab-lesson-1.pdf",
      isFreePreview: true,
      content: `# Lesson 1: Quantitative Strategy Architecture & Statistical Hypothesis Testing

## 1. Defining the Research Workflow
A systematic trading model is an empirical experiment. If you cannot articulate your edge in a formal mathematical hypothesis, you do not have a strategy—you have an opinion.

### The Quant Pipeline:
1. **Anomaly Identification**: Economic rationale (e.g., structural liquidity rebalancing by index funds at 4 PM).
2. **Data Sanitization**: Handling splits, dividends, survivorship bias, and tick timestamp discrepancies.
3. **Hypothesis Formulation**: Null hypothesis (\`H0: Strategy alpha = 0\`) against alternative (\`H1: Alpha > 0\`).
4. **Out-of-Sample Partitioning**: 70% Train, 15% Validation, 15% Untouched Forward Test.

---

## 2. Non-Stationarity: The Chief Nemesis of Market Modeling
Raw prices (\`P_t\`) are non-stationary random walks. Standard linear statistics applied to non-stationary series produce spurious correlations.
Always transform prices to **Log Returns**:
\`\`\`
r_t = ln(P_t / P_{t-1})
\`\`\`
Or fractional differentiation to preserve long-memory while achieving stationarity.`,
    },
  });

  await prisma.lesson.create({
    data: {
      courseId: courseQuant.id,
      title: "Mean Reversion vs Trend Following: Regime Classification",
      slug: "mean-reversion-trend-regimes",
      moduleTitle: "Module 2: Market Regimes",
      order: 2,
      duration: "45 min read • 22 Pages Lab",
      summary: "Autocorrelation, Hurst Exponent calculations, and Hidden Markov Models for adaptive market switching.",
      pdfUrl: "/api/lessons/download/quant-lab-lesson-2.pdf",
      isFreePreview: false,
      content: `# Lesson 2: Mean Reversion vs Trend Following

## 1. The Hurst Exponent (H)
The Hurst Exponent quantifies the trending or mean-reverting propensity of a time series:
- **H < 0.5**: The series is mean-reverting (anti-persistent). Price surges are likely followed by reversals.
- **H = 0.5**: The series is a geometric Brownian motion (pure random walk).
- **H > 0.5**: The series is trend-reinforcing (persistent). Momentum strategies thrive here.

---

## 2. Cointegration in Pairs Trading
Two assets may wander randomly, yet their linear combination can remain tightly bound around a mean. This is **Cointegration (Engle-Granger Two-Step Test)**.
Deploying an Ornstein-Uhlenbeck process on the spread provides deterministic entry/exit z-scores with mathematically bound stop-outs.`,
    },
  });

  // Course 3: Real Estate Deal Analysis & Funding Strategy
  const courseRE = await prisma.course.create({
    data: {
      title: "Real Estate Deal Analysis & Funding Strategy",
      slug: "real-estate-deal-analysis-funding",
      tagline: "Institutional-grade underwriting, private debt structuring, DSCR financing, and syndication waterfall mastery.",
      summary: "A 6-week hands-on deal lab designed to guide you through property underwriting, cashflow math, and financing options. Analyze real multi-family and commercial pro formas, calculate debt service covenants, and master equity waterfalls.",
      description: `### Deal Lab Overview

Move beyond retail real estate calculators. This laboratory equips you with the exact spreadsheet engines, debt structuring models, and deal evaluation frameworks utilized by private equity real estate funds.

### What Makes This Lab Unique

- Real-world acquisition case studies based on actual European and US multi-family and commercial portfolios.
- Comprehensive underwriting templates modeling 10-year hold periods, renovation & maintenance reserve schedules, and refinancing events.
- Advanced equity waterfall structuring: European vs American waterfalls, preferred returns, hurdle rates, and GP promote splits.`,
      price: 499,
      originalPrice: 799,
      currency: "EUR",
      level: "INTERMEDIATE",
      duration: "8 Lessons • 6 Weeks Structured Lab",
      format: "Dynamic Excel Financial Models + Underwriting Case Studies + Audio Walkthroughs",
      published: true,
      featured: false,
      order: 3,
      badge: "SPECIALIZED DEAL LAB",
      coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      highlights: [
        "8 Full Technical Deal Lessons & Institutional Underwriting Templates",
        "DSCR & Debt Yield Stress Testing Spreadsheet Engines",
        "Syndication Legal Terms Checklist and Offering Memorandum Guide",
        "Real Estate Private Equity Waterfall Calculator (Excel / Sheets)",
      ],
      whatYouWillLearn: [
        "Construct multi-family dynamic 10-year pro forma cash flow models from scratch",
        "Evaluate Debt Yield, Loan-to-Cost (LTC), and Loan-to-Value (LTV) constraints",
        "Structure investor hurdle rates with preferred returns (8%) and promote tiers (70/30, 80/20)",
        "Negotiate non-bank bridge loans, mezzanine debt, and seller financing notes",
      ],
      requirements: [
        "Basic familiarity with real estate terminology (NOI, Cap Rate)",
        "Proficiency in basic spreadsheet formulas (SUM, IRR, NPV)",
      ],
      categoryId: catRealEstate.id,
    },
  });

  // Course 3 Lessons
  await prisma.lesson.create({
    data: {
      courseId: courseRE.id,
      title: "Commercial vs Residential Pro Forma Underwriting",
      slug: "commercial-vs-residential-underwriting",
      moduleTitle: "Module 1: Pro Forma Architecture",
      order: 1,
      duration: "35 min read • 18 Pages Lab",
      summary: "Building dynamic T12 income statements, calculating economic vs physical vacancy, and CapEx reserves.",
      pdfUrl: "/api/lessons/download/re-lab-lesson-1.pdf",
      isFreePreview: true,
      content: `# Lesson 1: Commercial vs Residential Pro Forma Underwriting

## 1. Economic Vacancy vs Physical Vacancy
Amateur investors look only at **Physical Vacancy** (e.g. 95% of units occupied).
Institutional underwriters inspect **Economic Vacancy**:
\`\`\`
Economic Vacancy = (Gross Potential Rent - Gross Actual Collected Rent) / Gross Potential Rent
\`\`\`
Economic vacancy exposes non-paying tenants, concessions (e.g. "one month free rent"), administrative units, and employee discounts that mask fundamental property distress.`,
    },
  });

  // Course 4: AI-Powered Digital Business Systems
  const courseAI = await prisma.course.create({
    data: {
      title: "AI-Powered Digital Business Systems",
      slug: "ai-powered-digital-business-systems",
      tagline: "Build automated research engines, autonomous marketing funnels, and programmatic financial workflows with AI.",
      summary: "A 4-week tactical blueprint for operators who want to supercharge their digital footprint with autonomous AI agents, programmatic content architectures, and streamlined lead-to-cash pipelines.",
      description: `### Program Overview

Harness the power of autonomous LLMs and modern workflow orchestration to run scalable digital business infrastructure with minimal headcount.

We bypass superficial chatbot tricks to construct production-ready automated systems: financial research pipelines, real-time market sentiment scrapers, automated prospect qualification, and self-optimizing distribution engines.`,
      price: 399,
      originalPrice: 599,
      currency: "EUR",
      level: "INTERMEDIATE",
      duration: "6 Lessons • 4 Weeks Structured Lab",
      format: "Automation Webhook Blueprints + Agent Prompt Libraries + Video Walkthroughs",
      published: true,
      featured: false,
      order: 4,
      badge: "AUTOMATION ENGINE",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      highlights: [
        "6 Architecture Modules with ready-to-import webhook templates",
        "Autonomous LLM Prompt Stacks for Financial Document Analysis",
        "Programmatic SEO & Content Distribution Pipelines",
        "Complete No-Code to Code integration recipes",
      ],
      whatYouWillLearn: [
        "Deploy autonomous agents to scrape, parse, and summarize SEC filings & annual reports",
        "Build frictionless lead-capture to digital fulfillment webhook workflows",
        "Automate personalized client onboarding and self-serve educational delivery",
        "Engineer resilient system fallback triggers to prevent operational failure",
      ],
      requirements: [
        "Interest in automation and digital product distribution",
        "No advanced coding required; works with modern APIs and no-code tools",
      ],
      categoryId: catAI.id,
    },
  });

  // Course 4 Lesson
  await prisma.lesson.create({
    data: {
      courseId: courseAI.id,
      title: "Autonomous Financial Data Pipelines & Agent Workflows",
      slug: "autonomous-financial-data-pipelines",
      moduleTitle: "Module 1: AI Data Architecture",
      order: 1,
      duration: "30 min read • 15 Pages Lab",
      summary: "Connecting LLM orchestrators to real-time market data feeds, document vectorization, and automated insight generation.",
      pdfUrl: "/api/lessons/download/ai-lab-lesson-1.pdf",
      isFreePreview: true,
      content: `# Lesson 1: Autonomous Financial Data Pipelines

## 1. The Retrieval-Augmented Generation (RAG) Architecture for Financial Markets & Research
Generic LLMs hallucinate financial metrics. To achieve institutional reliability, implement strict grounding via vector embeddings and deterministic SQL pipelines.
- Step 1: Ingest structured corporate filings (10-K, 10-Q) into structured chunks.
- Step 2: Index text with high-dimensional dense embeddings.
- Step 3: Require the LLM to output footnotes and exact balance sheet line items for every quantitative assertion.`,
    },
  });

  console.log("📚 Created courses and lessons");

  // 5. Enrollments & Progress for Demo Student
  const enrollment1 = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: courseMaster.id,
      pricePaid: 249,
      paymentMethod: "MOCK_CARD",
      status: "ACTIVE",
      billingDetails: JSON.stringify({
        cardLast4: "4242",
        cardBrand: "Visa",
        name: "Alexander Hayes",
        country: "United Kingdom",
      }),
    },
  });

  const enrollment2 = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: courseQuant.id,
      pricePaid: 699,
      paymentMethod: "MOCK_SEPA",
      status: "ACTIVE",
      billingDetails: JSON.stringify({
        ibanLast4: "8890",
        bankName: "Barclays Private Client",
        name: "Alexander Hayes",
        country: "United Kingdom",
      }),
    },
  });

  // Mark lesson progress
  await prisma.lessonProgress.create({
    data: {
      userId: student.id,
      lessonId: c1l1.id,
      completed: true,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: student.id,
      lessonId: c1l2.id,
      completed: true,
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: student.id,
      lessonId: c1l3.id,
      completed: false,
    },
  });

  // 6. Activities
  await prisma.activity.createMany({
    data: [
      {
        userId: student.id,
        type: "ENROLLED",
        title: "Enrolled in Flagship Program",
        description: "Enrolled in The Financial Skool Master Program via Instant Mock Checkout.",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        userId: student.id,
        type: "COMPLETED_LESSON",
        title: "Completed Lesson 1",
        description: "Finished Foundations of Wealth, Liquidity, and Credit Architecture manual.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId: student.id,
        type: "COMPLETED_LESSON",
        title: "Completed Lesson 2",
        description: "Finished Real Estate Asset Underwriting & Physical Fundamentals manual.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId: student.id,
        type: "SIMULATION_RUN",
        title: "Simulated Risk Limits in Drawdown Engine",
        description: "Executed 1,000-iteration Monte Carlo drawdown simulation with 2.0 Risk-to-Reward ratio.",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ],
  });

  // 7. Reviews
  await prisma.review.createMany({
    data: [
      {
        userId: student.id,
        courseId: courseMaster.id,
        rating: 5,
        studentName: "Julian Knight",
        studentRole: "Financial Skool Alumnus & Tech Lead",
        comment:
          "The PDF manuals are exceptional. Unlike videos where 90% is filler, these 14-page playbooks read like clear, actionable blueprints. The personal financial architecture and credit modules completely transformed how I manage my savings and borrow at the lowest rates.",
      },
      {
        userId: student.id,
        courseId: courseMaster.id,
        rating: 5,
        studentName: "Elena Rostova",
        studentRole: "Property Investor & Small Business Owner",
        comment:
          "Zero hype, zero trading room gimmicks. The real estate underwriting equations and DSCR models are crystal clear. Financial Skool has completely rewritten how I analyze rental properties and evaluate commercial deals.",
      },
      {
        userId: student.id,
        courseId: courseQuant.id,
        rating: 5,
        studentName: "David Miller",
        studentRole: "Systematic Trader & Software Engineer",
        comment:
          "The Drawdown Simulator and risk management lessons provided the exact mathematical foundation I needed to eliminate emotional mistakes and protect my portfolio. Outstanding platform.",
      },
      {
        userId: student.id,
        courseId: courseAI.id,
        rating: 5,
        studentName: "Sophia Al-Mansoor",
        studentRole: "Digital Agency Founder & Member",
        comment:
          "The automated digital business systems module gave me a step-by-step roadmap for building high-margin digital workflows. The lifetime access model without recurring subscription fees is refreshing.",
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
