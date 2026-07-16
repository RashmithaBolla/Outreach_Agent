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
| AI / LLM | OpenAI GPT-4o-mini via OpenRouter |

---

## Features

- **Lead Queue** — Browse 12 sample leads with score and classification badges
- **Lead Enrichment** — Fetch detailed company data (industry, funding, tech stack, buying signals)
- **AI Lead Scoring** — GPT-4o-mini scores each lead 0–100 using identity-blind business attributes, with reasoning and per-factor breakdown
- **Classification** — Auto-classify as Hot / Nurture / Disqualified based on AI score
- **AI Email Draft** — GPT-4o-mini generates unique, personalized outreach emails per lead using their specific buying signals, tech stack, and recent news
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
    → AI Score Lead      (GPT-4o-mini scores 0–100, identity-blind, with reasoning)
    → Classify           (Hot / Nurture / Disqualified)
    → Route              (Hot → draft email, Nurture → nurture, Disqualified → archive)
    → AI Draft Email     (GPT-4o-mini writes personalized email using real enriched data)
    → Human Approval     (Approve / Edit / Reject)
    → Send Email         (only unlocked after approval)
```

---

## Project Structure

```
outreach-agent/
├── backend/
│   ├── main.py              # FastAPI app with all endpoints + LLM logic
│   ├── requirements.txt
│   ├── .env                 # API keys (not committed)
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
- An OpenRouter API key (free at [openrouter.ai](https://openrouter.ai)) **or** an OpenAI API key

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```env
# Option A — OpenRouter (supports GPT-4o, Claude, Gemini, etc.)
OPENAI_API_KEY=sk-or-v1-your-openrouter-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1

# Option B — Direct OpenAI
OPENAI_API_KEY=sk-proj-your-openai-key
```

Then start the server:

```bash
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
| POST | `/score` | AI score a lead (GPT-4o-mini, identity-blind) |
| POST | `/classify` | Classify as Hot/Nurture/Disqualified |
| POST | `/draft-email` | AI-generate personalized email draft |
| POST | `/approve` | Approve or reject an email |
| POST | `/send-email` | Send email (only if approved) |
| GET | `/logs` | Get full activity log |
| GET | `/stats` | Get pipeline statistics |

---

## AI Scoring Logic (Identity-Blind)

Scoring is handled by GPT-4o-mini. Only business attributes are included in the prompt — name, email, and personal details are never sent to the model.

| Factor | Max Points |
|---|---|
| Company Size | 25 |
| Role Seniority | 20 |
| Industry Fit | 20 |
| Funding Stage | 20 |
| Hiring Activity | 15 |
| **Total** | **100** |

The model returns a score, one-sentence reasoning, and a per-factor breakdown.

**Classification thresholds:**
- **80–100** → 🔥 Hot
- **50–79** → 💧 Nurture
- **0–49** → ⚫ Disqualified

---

## AI Email Drafting

Emails are generated by GPT-4o-mini using each lead's enriched data:
- References their specific recent news and buying signals
- Tailored to their industry and tech stack
- Under 150 words, conversational tone
- Soft CTA (15-min call, not a demo)
- Every lead gets a unique, non-generic email

---

## Governance

Every action is logged with:
- Lead name and ID
- Action type
- Details / reasoning (including AI score breakdown)
- Timestamp

No email is ever sent without human approval. The Send button is disabled until an explicit Approve action is taken.
