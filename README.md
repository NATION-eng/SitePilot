# SitePilot - Smart Construction Intelligence Platform

An expert-algorithm construction estimator that helps construction companies plan smarter, reduce waste, and deliver projects on budget through intelligent pre-construction analysis.

## 🚀 Features

- **Smart Material Estimation** - Intelligent calculation of cement, blocks, steel, sand, gravel, and roofing materials based on Nigerian QS heuristics
- **Cost Intelligence** - Comprehensive cost breakdown with budget risk analysis
- **Risk Detection** - Warnings for over-ordering, under-budget, and timeline risks
- **Professional Reports** - One-click PDF export of project analysis
- **Multi-step Workflow** - Guided project setup flow for accurate estimates

## 🛠️ Tech Stack

- **React 18** - Modern component-based UI
- **Pricing Engine** - Deterministic construction cost formula (`src/utils/pricingEngine.js`) based on Nigerian QS standards
- **CSS Modules + Custom Properties** - Scoped styles with design token system (`App.css`, `*.module.css`)
- **html2pdf.js** - Client-side PDF report generation
- **Responsive Design** - Works on desktop and mobile

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 🎯 Usage

1. **Start New Project** - Click "Get Free Estimate" on the homepage
2. **Select Project Type** - Choose between Residential, Commercial, or Industrial
3. **Enter Details** - Provide location, building size, and number of floors
4. **Set Budget & Timeline** - Define your financial and time constraints
5. **Generate Analysis** - The pricing engine calculates comprehensive estimates
6. **Download Report** - Export a professional PDF report for clients

## 🏗️ Project Structure

```
sitepilot/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Hero.js
│   │   ├── FormContainer.js       # Step switcher + ProgressBar wrapper
│   │   ├── ProgressBar.js
│   │   ├── SEO.js
│   │   ├── ErrorBoundary.js
│   │   ├── Steps/
│   │   │   ├── StepOne.js
│   │   │   ├── StepTwo.js
│   │   │   ├── StepThree.js
│   │   │   └── LoadingStep.js
│   │   ├── Results/
│   │   │   ├── Results.js
│   │   │   ├── MaterialEstimates.js
│   │   │   ├── CostAnalysis.js
│   │   │   ├── RiskAssessment.js
│   │   │   └── Recommendations.js
│   │   └── ui/
│   │       ├── Button.js
│   │       ├── Button.module.css
│   │       ├── Input.js
│   │       └── Input.module.css
│   ├── context/
│   │   └── ProjectContext.js      # Global state via React Context
│   ├── hooks/
│   │   ├── useFormValidation.js
│   │   ├── useLocalStorage.js
│   │   └── useMultiStepForm.js
│   ├── utils/
│   │   └── pricingEngine.js       # Core cost calculation logic
│   ├── App.js
│   ├── App.css                    # Global design tokens + utility classes
│   └── index.js
├── package.json
└── README.md
```

## 💡 How the Pricing Engine Works

`src/utils/pricingEngine.js` is the heart of SitePilot. It uses **standard Nigerian quantity surveying heuristics** and 2026 market prices to calculate:

- **Phase 1 – Structure:** Cement, blocks, steel, aggregates, roofing
- **Phase 2 – Finishing:** Tiles, POP ceiling, paint, windows, doors
- **Phase 3 – Services & Labour:** MEP (18% of direct costs), blended labour rate
- **Phase 4 – Contingency:** Deterministic variance of 5–10% based on project size

> ⚠️ Prices are last updated per `pricing.config.json`. See that file to update rates without a code deploy.

## 🔮 Future: Claude AI Integration

A future version will replace / augment the local formula with server-side Claude AI inference. **This must always be implemented as a backend API proxy** — never expose an Anthropic API key in the client bundle.

```
User → SitePilot Frontend → /api/analyze (your server) → Anthropic Claude API
```

Example server-side handler (Node.js / Express):

```javascript
app.post('/api/analyze', async (req, res) => {
  // 1. Validate input
  // 2. Call Claude API using process.env.ANTHROPIC_API_KEY (server-side only)
  // 3. Return result to client
});
```

## 🎨 Design System

- **Dark theme** — `#0A0E14` background, `#FF6B00` brand orange
- **Typography** — IBM Plex Mono (display), Work Sans (body)
- **All design tokens** defined as CSS custom properties in `src/App.css`
- **Component-level styles** via CSS Modules (`*.module.css`)

## 📊 Business Model

**Target Audience:**
- Construction companies
- Contractors & project managers
- Property developers
- Engineering firms

**Value Proposition:**
- Reduce material waste by 15–20%
- Improve cost estimation accuracy by 30%
- Generate professional client-ready reports instantly

## 🚢 Deployment

```bash
npm run build
# Deploy the /build folder to Vercel, Netlify, etc.
```

## 📝 License

Proprietary — All rights reserved

---

**Version:** 1.1.0  
**Last Updated:** August 2026
