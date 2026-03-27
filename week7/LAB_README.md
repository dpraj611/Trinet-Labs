# Week 7 Lab — AI Risk Assessment & Governance

This is an interactive React app that simulates an **AI Security Audit** of a fictional AI-based hiring system called *TalentAI Pro*. You will assess risks, detect biases, and respond to a critical incident.

---

## 🛠️ Setup & Running Locally

### Prerequisites

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |

> Download Node.js from [https://nodejs.org](https://nodejs.org) if you don't have it.

### Steps

```bash
# 1. Navigate to the lab folder
cd path/to/week7

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open at **http://localhost:5173** (or the next available port shown in the terminal).

### Other Useful Commands

```bash
npm run build      # Build for production (outputs to /dist)
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint checks
npm run typecheck  # Run TypeScript type checking
```

### Common Issues

- **`node` not found** → Install Node.js from nodejs.org and restart your terminal.
- **Port already in use** → Vite will automatically try the next port; check the terminal output.
- **`npm install` fails** → Delete `node_modules` and `package-lock.json`, then run `npm install` again.

---

## 🗺️ Lab Structure

The lab is a 5-step wizard. Each step must be completed before moving to the next.

```
Step 1: Scenario Introduction   → Read the brief, review outputs & logs
Step 2: Risk Assessment         → Rate severity & likelihood for each risk
Step 3: Bias Evaluation         → Identify biases present in the data
Step 4: Incident Response       → Handle a simulated critical AI failure
Step 5: Final Report            → View your total score and download the report
```

**Passing score: 150 out of 200**

---

## ✅ Lab Solutions Guide

### Step 1 — Scenario Introduction

Read through the scenario carefully. Note the following red flags in the data:

- Candidates with **non-Western names** (Maria Garcia, Mohammed Ali, Yuki Tanaka, Jamal Washington) are **rejected** despite high experience and top-tier education.
- Candidates with **Western names** (Sarah Johnson, James Smith, Emily White, Michael Brown) are **accepted** even with lower experience.
- System logs show: `WARN: Low confidence scores for candidates with non-Western names` and `Training data last updated: 2020-12-15`.

Click **Start Audit** to begin.

---

### Step 2 — Risk Assessment

You must set **Severity** and **Likelihood** for every risk. The "Continue" button stays disabled until all 5 are rated.

Recommended ratings based on the scenario evidence:

| Risk | Severity | Likelihood |
|------|----------|------------|
| Model bias in candidate selection | **High** | **High** |
| Prompt injection vulnerability | **High** | **Medium** |
| Lack of input validation | **Medium** | **High** |
| Data leakage risk | **Medium** | **Low** |
| Over-reliance on automation | **High** | **High** |

Add notes explaining your reasoning for each; notes are included in the final downloaded report but do **not** affect the score.

---

### Step 3 — Bias Evaluation *(scored — 100 pts max)*

**Only two biases are correct** based on the data. Selecting wrong ones costs points.

#### Scoring formula
```
Score = (correct selections × 50) − (incorrect selections × 20) − (missed correct × 30)
```

#### ✅ Correct biases to select

1. **Ethnic/Name-Based Bias** ✔️
   - Evidence: 75% of non-Western-named candidates are rejected vs 75% of Western-named candidates accepted, despite equal or superior qualifications. The system log explicitly warns about low confidence scores for non-English names.

2. **Data Imbalance** ✔️
   - Evidence: Training data is from 2015–2020 and was last updated December 2020. Historical hiring data from that era likely underrepresents diverse candidates, causing skewed predictions.

#### ❌ Do NOT select these (no evidence in the data)

- **Gender Bias** — Outcomes are mixed across genders; no consistent gender-based pattern.
- **Proxy Variable Bias** — No evidence the model is using zip code or university as proxies for protected characteristics.

After checking both correct biases, write a detailed explanation (at least 10 characters) in each text box, then click **Continue**.

---

### Step 4 — Incident Response Simulation *(scored — 100 pts max)*

A critical incident has occurred: the rejection rate spiked to 90% after a suspected prompt injection. The phase is split into 3 sub-steps.

#### Scoring formula
```
Phase 1: correct immediate action = +30 pts
Phase 2: each correct containment = +25 pts, each wrong = −10 pts
Phase 3: each correct long-term fix = +25 pts, each wrong = −10 pts
```

#### Phase 1 — Immediate Action (pick one)

✅ **Disable the system immediately** → +30 pts  
This is the only correct answer. Stopping the system prevents further discriminatory decisions and regulatory exposure.

#### Phase 2 — Containment Measures (select all that apply)

| Option | Points | Reason |
|--------|--------|--------|
| ✅ Implement input filtering | +25 | Blocks the malicious prompt injection |
| ✅ Rollback to previous model version | +25 | Restores known stable behaviour |
| ❌ Block malicious query patterns | −10 | Reactive, not a direct fix |
| ❌ Enable rate limiting | −10 | Doesn't address the root cause |

**Select: "Implement input filtering" + "Rollback to previous model version"**

#### Phase 3 — Long-Term Prevention (select all that apply)

| Option | Points | Reason |
|--------|--------|--------|
| ✅ Add comprehensive guardrails | +25 | Prevents future prompt injection and bad inputs |
| ✅ Deploy continuous monitoring | +25 | Catches anomalies like the 90% rejection rate spike early |
| ❌ Retrain model with adversarial examples | −10 | Useful but not specifically targeted at this incident |
| ❌ Improve dataset diversity | −10 | Addresses bias, not the injection incident |
| ❌ Establish regular security audits | −10 | Valuable practice but not a direct prevention measure |

**Select: "Add comprehensive guardrails" + "Deploy continuous monitoring"**

Click **Complete Audit** to go to the final report.

---

### Step 5 — Final Report

Your score is displayed as `X / 200`. To **pass** you need **≥ 150**.

#### Maximum score breakdown

| Section | Max Points |
|---------|-----------|
| Bias Evaluation | 100 |
| Incident Response | 100 |
| **Total** | **200** |

Following the guide above gives:
- Bias: `(2 × 50) = 100 pts`
- Incident: `30 + (2 × 25) + (2 × 25) = 130 pts`
- **Total: 200 / 200** ✅

You can click **Download Report** to save a `.txt` summary of your full audit.

---

## 📁 Project Structure

```
week7/
├── src/
│   ├── App.tsx                    # Main app, state management, routing between steps
│   └── components/
│       ├── ScenarioIntro.tsx      # Step 1 — Audit scenario and context
│       ├── RiskAssessment.tsx     # Step 2 — Risk rating interface
│       ├── BiasEvaluation.tsx     # Step 3 — Bias detection (scored)
│       ├── IncidentResponse.tsx   # Step 4 — Incident simulation (scored)
│       ├── FinalReport.tsx        # Step 5 — Score display + report download
│       └── ProgressIndicator.tsx  # Step progress bar shown from step 2 onwards
├── index.html
├── package.json
└── vite.config.ts
```
