# PipelineIQ – Lead Qualification & Outreach Agent

A full-stack AI-powered sales pipeline application that helps SDRs qualify leads, score them, and send personalized outreach emails — with mandatory human approval before any email is sent.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| State | React Context |
| Backend | Python FastAPI |
| HTTP Client | Axios |

---

## Features

- **Lead Queue** — Browse 12 sample leads with score and classification badges
- **Lead Enrichment** — Fetch detailed company data (industry, funding, tech stack, buying signals)
- **Lead Scoring** — Identity-blind scoring based purely on business attributes (0–100)
- **Classification** — Auto-classify as Hot / Nurture / Disqualified based on score
- **Email Draft** — Generate personalized outreach emails using enriched data
- **Human Approval** — Emails require explicit approval before sending (never automatic)
- **Activity Logs** — Full audit trail of every action with search, filter, and pagination
- **ICP Settings** — Configure your Ideal Customer Profile (industries, roles, weights)
- **Dark Mode** — Full dark/light mode toggle, persisted to localStorage
- **Animated UI** — Loading screen, animated counters, circular score rings, toast notifications

---

## Workflow

```
Lead Arrives
    → Enrich Lead        (fetch company data)
    → Score Lead         (0–100, business attributes only)
    → Classify           (Hot / Nurture / Disqualified)
    → Route              (Hot → draft email, Nurture → nurture, Disqualified → archive)
    → Draft Email        (personalized using real enriched data)
    → Human Approval     (Approve / Edit / Reject)
    → Send Email         (only unlocked after approval)
```

---

## Project Structure

```
outreach-agent/
├── backend/
│   ├── main.py              # FastAPI app with all endpoints
│   ├── requirements.txt
│   └── venv/                # Python virtual environment (not committed)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/      # CircularProgress, LoadingScreen, ToastContainer
    │   │   ├── dashboard/   # LeadQueue, LeadDetails, EmailPanel, StatsCards, Timeline
    │   │   └── layout/      # Navbar, Sidebar, DashboardLayout
    │   ├── context/         # LeadContext, DarkModeContext, ToastContext
    │   ├── pages/           # Dashboard, Logs, Settings
    │   ├── services/        # api.js (Axios calls)
    │   └── mock/            # leads.js (sample data)
    ├── package.json
    └── vite.config.js
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/leads` | Get all leads with current state |
| GET | `/leads/{id}` | Get single lead |
| POST | `/enrich` | Enrich a lead |
| POST | `/score` | Score a lead (identity-blind) |
| POST | `/classify` | Classify as Hot/Nurture/Disqualified |
| POST | `/draft-email` | Generate personalized email draft |
| POST | `/approve` | Approve or reject an email |
| POST | `/send-email` | Send email (only if approved) |
| GET | `/logs` | Get full activity log |
| GET | `/stats` | Get pipeline statistics |

---

## Scoring Logic (Identity-Blind)

Only business attributes affect the score. No personal attributes (name, gender, age, nationality, religion) are used.

| Factor | Max Points |
|---|---|
| Company Size | 25 |
| Role Seniority | 20 |
| Industry Fit | 20 |
| Funding Stage | 20 |
| Hiring Activity | 15 |
| **Total** | **100** |

**Classification thresholds:**
- **80–100** → 🔥 Hot
- **50–79** → 💧 Nurture  
- **0–49** → ⚫ Disqualified

---

## Governance

Every action is logged with:
- Lead name and ID
- Action type
- Details / reasoning
- Timestamp

No email is ever sent without human approval. The Send button is disabled until an explicit Approve action is taken.
