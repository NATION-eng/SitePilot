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
                  │ HTTP Request
                  ▼
┌─────────────────────────────────────────┐
│         Anthropic Claude API            │
│  (AI Construction Intelligence Engine)  │
└─────────────────┬───────────────────────┘
                  │
                  │ JSON Response
                  ▼
┌─────────────────────────────────────────┐
│          Results Processing             │
│  • Material Estimates                   │
│  • Cost Analysis                        │
│  • Risk Assessment                      │
│  • Recommendations                      │
└─────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
sitepilot/
│
├── public/
│   └── index.html              # HTML template
│
├── src/
│   ├── components/             # React components
│   │   ├── Header.js           # App header with logo
│   │   ├── Hero.js             # Landing page hero section
│   │   ├── FormContainer.js    # Form wrapper component
│   │   ├── ProgressBar.js      # Multi-step progress indicator
│   │   │
│   │   ├── Steps/              # Form steps
│   │   │   ├── StepOne.js      # Project type selection
│   │   │   ├── StepTwo.js      # Project details input
│   │   │   ├── StepThree.js    # Budget & timeline
│   │   │   └── LoadingStep.js  # AI processing indicator
│   │   │
│   │   └── Results/            # Results display
│   │       ├── Results.js      # Main results container
│   │       ├── MaterialEstimates.js
│   │       ├── CostAnalysis.js
│   │       ├── RiskAssessment.js
│   │       └── Recommendations.js
│   │
│   ├── App.js                  # Main app logic & state
│   ├── index.js                # React entry point
│   └── styles.js               # Centralized styling
│
├── package.json                # Dependencies
├── README.md                   # User documentation
├── DEPLOYMENT.md               # Deployment guide
├── ARCHITECTURE.md             # This file
└── .gitignore                  # Git ignore rules
```

---

## 🧩 Component Hierarchy

```
App (State Management)
│
├── Header (Static)
│
├── Hero (Landing)
│   └── CTA Button → startProject()
│
├── FormContainer (Multi-step form)
│   ├── ProgressBar
│   └── Dynamic Steps
│       ├── StepOne (Project Type)
│       ├── StepTwo (Details)
│       ├── StepThree (Budget)
│       └── LoadingStep (AI Processing)
│
└── Results (Analysis Display)
    ├── MaterialEstimates
    ├── CostAnalysis
    ├── RiskAssessment
    └── Recommendations
```

---

## 🔄 State Management

### App-level State (src/App.js):

```javascript
const [view, setView] = useState('hero');
// Controls: 'hero' | 'form' | 'results'

const [currentStep, setCurrentStep] = useState(1);
// Controls: 1, 2, 3, 4 (form steps)

const [projectData, setProjectData] = useState({
  projectType: '',      // 'residential' | 'commercial' | 'industrial'
  location: '',         // string
  buildingSize: '',     // number (sqm)
  floors: '',           // number
  budget: '',           // number (₦)
  timeline: '',         // number (months)
  notes: ''            // string (optional)
});

const [analysisResults, setAnalysisResults] = useState(null);
// Stores AI-generated analysis
```

### State Flow:

```
Hero → Click "Start Project"
  ↓
Form (Step 1) → Select Project Type → updateProjectData()
  ↓
Form (Step 2) → Enter Details → updateProjectData()
  ↓
Form (Step 3) → Set Budget/Timeline → updateProjectData()
  ↓
Form (Step 4) → Loading → generateAnalysis()
  ↓
API Call → Claude AI → JSON Response
  ↓
Results → Display Analysis → setAnalysisResults()
```

---

## 🤖 AI Integration

### API Endpoint:
```
POST https://api.anthropic.com/v1/messages
```

### Request Format:
```javascript
{
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1000,
  messages: [{
    role: 'user',
    content: 'Project details + Analysis request'
  }]
}
```

### Response Structure:
```json
{
  "materials": {
    "cement": "X bags",
    "blocks": "X pieces",
    "steel": "X tons",
    "sand": "X tons",
    "gravel": "X tons",
    "roofing": "X sqm"
  },
  "costs": {
    "materials": 5000000,
    "labor": 3000000,
    "equipment": 1500000,
    "contingency": 950000,
    "total": 10450000
  },
  "risk": {
    "level": "Medium",
    "budgetRisk": "Budget is slightly below average...",
    "timelineRisk": "Timeline is realistic for project size..."
  },
  "warnings": ["Warning 1", "Warning 2"],
  "recommendations": ["Rec 1", "Rec 2", "Rec 3"]
}
```

---

## 🎨 Styling Architecture

### Design System:

**Colors:**
```javascript
--primary: #FF6B00        // Brand orange
--bg-dark: #0A0E14        // Background
--bg-card: #141921        // Cards
--text-primary: #E8ECF0   // Main text
--text-secondary: #8B95A5 // Secondary text
--success: #00D9A3        // Success states
--warning: #FFB800        // Warnings
--danger: #FF4757         // Errors
```

**Typography:**
- Display: IBM Plex Mono (monospace, technical)
- Body: Work Sans (clean, professional)

**Layout:**
- Container max-width: 1400px
- Padding: 2rem
- Card border-radius: 12px
- Button border-radius: 6px-8px

---

## 🔌 Data Flow

### Form Submission Flow:

```
User Input → updateProjectData()
  ↓
projectData state updated
  ↓
User clicks "Generate Analysis"
  ↓
generateAnalysis() called
  ↓
Set currentStep to 4 (Loading)
  ↓
Fetch API (Claude)
  ↓
Parse JSON response
  ↓
setAnalysisResults(analysis)
  ↓
setView('results')
  ↓
Results component renders
```

### Error Handling:

```javascript
try {
  // API call
} catch (error) {
  console.error('Error:', error);
  alert('Failed to generate analysis. Please try again.');
  setIsLoading(false);
  setCurrentStep(3); // Back to form
}
```

---

## 🧪 Testing Strategy

### Unit Tests:
- Component rendering
- State updates
- Input validation
- API response parsing

### Integration Tests:
- Multi-step form flow
- API integration
- Results display

### E2E Tests:
- Complete user journey
- Error scenarios
- Browser compatibility

---

## 📊 Performance Considerations

### Current Optimizations:
- CSS-in-JS (no external stylesheets)
- Inline styles (component isolation)
- Minimal dependencies
- Single-page architecture

### Future Optimizations:
- Code splitting (lazy loading)
- Service worker (offline support)
- Image optimization
- API response caching
- Memoization for expensive calculations

---

## 🔐 Security Considerations

### Current Implementation:
⚠️ **Client-side API calls** (MVP only)
- API key exposed in browser
- Not suitable for production

### Production Requirements:
✅ **Backend API proxy**
- Hide API keys server-side
- Implement rate limiting
- Add authentication
- Validate user input

### Example Backend (Node.js):

```javascript
const express = require('express');
const app = express();

app.post('/api/analyze', async (req, res) => {
  // Validate input
  if (!req.body.projectType) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Call Claude API server-side
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY
    },
    body: JSON.stringify({...})
  });

  const data = await response.json();
  res.json(data);
});
```

---

## 🚀 Scalability

### Current Limitations:
- No database (stateless)
- No user accounts
- No project history
- Client-side only

### Scaling Plan:

**Phase 1: Backend**
- Node.js/Express API
- PostgreSQL database
- User authentication

**Phase 2: Features**
- Save projects
- Project history
- Team collaboration
- Advanced analytics

**Phase 3: Enterprise**
- Multi-tenancy
- Custom models
- API access
- White-label options

---

## 📈 Analytics & Monitoring

### Recommended Integrations:

**Analytics:**
- Google Analytics 4
- Mixpanel
- Amplitude

**Error Tracking:**
- Sentry
- LogRocket
- Bugsnag

**Performance:**
- Lighthouse CI
- Web Vitals
- New Relic

---

## 🛠️ Development Workflow

```bash
# Start development
npm start

# Run tests
npm test

# Build for production
npm run build

# Analyze bundle size
npm run build && npx source-map-explorer build/static/js/*.js
```

---

## 📝 API Documentation

### generateAnalysis()

**Purpose:** Sends project data to Claude API and processes response

**Parameters:** None (uses state)

**Returns:** void (updates state)

**Side Effects:**
- Sets loading state
- Makes HTTP request
- Updates analysisResults state
- Changes view to 'results'

**Error Handling:**
- Catches API errors
- Shows alert to user
- Returns to previous step

---

## 🔄 Future Enhancements

### Short-term:
- [ ] Input validation
- [ ] Better error messages
- [ ] Loading animations
- [ ] Mobile optimization
- [ ] PDF export (proper library)

### Medium-term:
- [ ] User authentication
- [ ] Project saving
- [ ] Cost database
- [ ] Regional pricing
- [ ] Material suppliers integration

### Long-term:
- [ ] Machine learning models
- [ ] CAD integration
- [ ] BIM compatibility
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Maintained by:** SitePilot Team
