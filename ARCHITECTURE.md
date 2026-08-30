# SitePilot - Technical Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│          User Interface (React)         │
│  ┌────────┐  ┌────────┐  ┌──────────┐  │
│  │  Hero  │  │  Form  │  │ Results  │  │
│  └────────┘  └────────┘  └──────────┘  │
└─────────────────┬───────────────────────┘
                  │
                  │ Function Call (no network)
                  ▼
┌─────────────────────────────────────────┐
│      pricingEngine.js (local)           │
│  Deterministic QS Formula Engine        │
│  • Phase 1: Structure costs             │
│  • Phase 2: Finishing costs             │
│  • Phase 3: Labour & MEP                │
│  • Phase 4: Contingency                 │
└─────────────────┬───────────────────────┘
                  │
                  │ Results object
                  ▼
┌─────────────────────────────────────────┐
│          Results Display                │
│  • Material Estimates                   │
│  • Cost Analysis                        │
│  • Risk Assessment                      │
│  • Recommendations                      │
└─────────────────────────────────────────┘
```

> ℹ️ **No external API calls are made in v1.x.** All calculations run locally in the browser
> using the Nigerian QS heuristics defined in `pricingEngine.js` and priced via `pricing.config.json`.

---

## 📁 Project Structure

```
sitepilot/
│
├── public/
│   └── index.html              # HTML template (non-blocking font preload)
│
├── src/
│   ├── components/             # React components
│   │   ├── Header.js           # App header with logo
│   │   ├── Hero.js             # Landing page hero section
│   │   ├── FormContainer.js    # Step switcher + ProgressBar host
│   │   ├── ProgressBar.js      # Multi-step progress indicator (accessible)
│   │   ├── SEO.js              # Dynamic <title> + <meta description> side-effect
│   │   ├── ErrorBoundary.js    # Class component — catches React tree errors
│   │   │
│   │   ├── Steps/              # Form steps
│   │   │   ├── StepOne.js      # Project type selection (keyboard accessible)
│   │   │   ├── StepTwo.js      # Project details input
│   │   │   ├── StepThree.js    # Budget & timeline
│   │   │   └── LoadingStep.js  # Animated calculation progress indicator
│   │   │
│   │   ├── Results/            # Results display
│   │   │   ├── Results.js      # Main results container + PDF export
│   │   │   ├── MaterialEstimates.js
│   │   │   ├── CostAnalysis.js
│   │   │   ├── RiskAssessment.js
│   │   │   └── Recommendations.js
│   │   │
│   │   └── ui/                 # Reusable primitive components
│   │       ├── Button.js
│   │       ├── Button.module.css
│   │       ├── Input.js        # Accessible input with label + error binding
│   │       ├── Input.module.css
│   │       └── ConfirmDialog.js  # Modal dialog for destructive action confirmations
│   │
│   ├── context/
│   │   └── ProjectContext.js   # Global app state (view, steps, project data, results)
│   │
│   ├── hooks/
│   │   ├── useFormValidation.js  # Field-level validation (useReducer-based)
│   │   ├── useLocalStorage.js    # Persistent state across page refreshes
│   │   └── useMultiStepForm.js   # Step navigation logic
│   │
│   ├── utils/
│   │   └── pricingEngine.js    # Core cost calculation (reads pricing.config.json)
│   │
│   ├── pricing.config.json     # Material & labour rates (update without redeploy)
│   ├── App.js                  # Root layout + view switcher + a11y focus management
│   ├── App.css                 # Global design tokens (CSS custom properties) + utilities
│   └── index.js                # React entry point (wrapped in ErrorBoundary)
│
├── src/__tests__/
│   ├── pricingEngine.test.js   # Unit tests: known inputs → known outputs
│   └── useFormValidation.test.js
│
├── package.json
├── README.md
├── DEPLOYMENT.md
├── ARCHITECTURE.md             # This file
└── .gitignore
```

---

## 🧩 Component Hierarchy

```
index.js
└── ErrorBoundary (catches all React tree errors)
    └── ProjectProvider (global state)
        └── App (root layout + SEO)
            │
            ├── Header (static)
            │
            ├── [view === 'hero'] Hero
            │   └── CTA Button → startProject()
            │
            ├── [view === 'form'] section
            │   ├── Error State (if error)
            │   └── FormContainer
            │       ├── ProgressBar (reads currentStep, progress from context)
            │       └── form-card
            │           ├── [step 1] StepOne (project type)
            │           ├── [step 2] StepTwo (details)
            │           ├── [step 3] StepThree (budget / timeline)
            │           └── [step 4] LoadingStep (animated phases)
            │
            └── [view === 'results'] Results
                ├── MaterialEstimates
                ├── CostAnalysis
                ├── RiskAssessment
                └── Recommendations
```

---

## 🔄 State Management

### Global State — `src/context/ProjectContext.js`

```javascript
// View routing
const [view, setView] = useState('hero');
// 'hero' | 'form' | 'results'

// Step navigation (via useMultiStepForm hook)
currentStep  // 1–4
progress     // 0–100 (%)
isFirstStep, isLastStep

// Project inputs (persisted to localStorage)
const [projectData] = useLocalStorage('sitepilot-project', {
  projectType: '',   // 'residential' | 'commercial' | 'industrial'
  location: '',      // string (min 2 chars)
  buildingSize: '',  // number (sqm, 1–100,000)
  floors: '',        // number (1–100)
  budget: '',        // number (₦, 1–10,000,000,000)
  timeline: '',      // number (months, 1–120)
  notes: ''          // string (optional, max 500 chars)
});

// Results & async state
const [analysisResults, setAnalysisResults] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

// Screen-reader announcement channel
const [announcement, setAnnouncement] = useState('');
```

### State Flow

```
Hero → "Get Free Estimate"
  → startProject() → view='form', step=1
  ↓
Step 1 → Select project type → updateProjectData()
  ↓
Step 2 → Enter location, size, floors → updateProjectData()
  → validate() on each field
  ↓
Step 3 → Enter budget, timeline → updateProjectData()
  → validate() on each field
  ↓
"Generate Analysis" → generateAnalysis()
  → step=4 (LoadingStep with animated phases)
  → calculateConstructionCosts(projectData)  [synchronous]
  → setAnalysisResults(results)
  → view='results'
  ↓
Results → ConfirmDialog before resetProject()
  → view='hero'
```

---

## 🧮 Pricing Engine

### Source: `src/utils/pricingEngine.js`
### Config: `src/pricing.config.json`

The engine runs **entirely in the browser** — no network request is made.

#### Calculation Phases

| Phase | What's Calculated |
|---|---|
| 1 — Structure | Cement, blocks, steel (per floor), aggregates, roofing |
| 2 — Finishing | Tiles, POP ceiling, paint, windows, doors |
| 3 — Services & Labour | MEP = 18% of direct cost; Labour = 25% of direct cost |
| 4 — Contingency | 5–10% of subtotal (deterministic seed from project dimensions) |

#### Type Multipliers

| Project Type | Cost Multiplier |
|---|---|
| Residential | ×1.0 |
| Commercial | ×1.2 |
| Industrial | ×1.1 |

#### Output Shape

```json
{
  "materials": {
    "cement": "420 bags",
    "blocks": "1,500 pieces (9\")",
    "steel": "1.0 tons",
    "sand": "63 tons",
    "granite": "84 tons",
    "roofing": "140 sqm",
    "tiles": "125 sqm",
    "pop": "100 sqm",
    "paint": "9 drums",
    "windows": "23 sqm",
    "doors": "6 Internal, 2 Security"
  },
  "costs": {
    "cement": 3990000,
    "blocks": 750000,
    "steel": 1400000,
    "aggregates": 1218000,
    "roofing": 1050000,
    "tiles": 812500,
    "pop": 800000,
    "paint": 315000,
    "windows": 1035000,
    "doors": 660000,
    "m_e_p": 2372400,
    "labor": 3296400,
    "contingency": 845000,
    "total": 18543300
  },
  "risk": {
    "level": "Low | Medium | High",
    "budgetRisk": "string",
    "timelineRisk": "string"
  },
  "warnings": ["string"],
  "recommendations": ["string"]
}
```

---

## 🎨 Styling Architecture

### Design Tokens (`src/App.css` — `:root`)

```css
--primary: #FF6B00;          /* Brand orange */
--bg-dark: #0A0E14;          /* Page background */
--bg-card: #141921;          /* Card surface */
--bg-elevated: #1C2128;      /* Inputs, elevated surfaces */
--border: #2A3140;           /* Borders */
--text-primary: #E8ECF0;     /* Body text */
--text-secondary: #8B95A5;   /* Muted text */
--success: #00D9A3;          /* Low risk, complete */
--warning: #FFB800;          /* Warnings */
--danger: #FF4757;           /* Errors, high risk */
--font-display: 'IBM Plex Mono', monospace;
--font-body: 'Work Sans', sans-serif;
```

### Style Layers

| Layer | Location | Used For |
|---|---|---|
| Global tokens + utilities | `App.css` | Design system, layout, animations |
| Component-scoped | `*.module.css` | Button, Input primitives |

---

## 🔐 Security

### Current Implementation (v1.x — Local Engine)
✅ No API keys in client code  
✅ No network calls from the browser  
✅ User input sanitised before rendering  
✅ Input lengths bounded by validation + HTML `maxLength`

### Future: Claude AI Integration
When AI is introduced, it **must** follow the server-side proxy pattern:

```
Client → POST /api/analyze → Your server → Anthropic API
```

**Never** call `https://api.anthropic.com` directly from the browser. The API key must live only in server environment variables (`process.env.ANTHROPIC_API_KEY`).

---

## 🧪 Testing

```bash
npm test          # Runs Jest + React Testing Library in watch mode
npm test -- --coverage  # Generate coverage report
```

### Test Files

| File | Coverage |
|---|---|
| `src/__tests__/pricingEngine.test.js` | Unit tests for all calculation phases |
| `src/__tests__/useFormValidation.test.js` | Boundary conditions per field |

---

## 📈 Analytics & Monitoring (Recommended)

| Category | Tool |
|---|---|
| Error tracking | Sentry (ErrorBoundary already has TODO hook) |
| Analytics | Google Analytics 4 / Mixpanel |
| Performance | Lighthouse CI, Web Vitals |

---

## 🚀 Scalability Roadmap

**Phase 1 — Current (v1.x)**
- Local pricing engine, no backend, no auth

**Phase 2 — Backend**
- Node.js/Express API proxy for Claude AI
- PostgreSQL for project history
- User authentication (JWT/OAuth)

**Phase 3 — Features**
- Saved projects, team collaboration
- Regional pricing database
- Material supplier integrations

**Phase 4 — Enterprise**
- Multi-tenancy, white-label, API access
- CAD / BIM file import

---

**Version:** 1.1.0
**Last Updated:** August 2026
**Maintained by:** SitePilot Team
