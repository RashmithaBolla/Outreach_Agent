from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import random
import json
import os

from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()

# Initialize OpenAI client (supports OpenRouter via OPENAI_BASE_URL)
_openai_kwargs = {"api_key": os.getenv("OPENAI_API_KEY")}
if os.getenv("OPENAI_BASE_URL"):
    _openai_kwargs["base_url"] = os.getenv("OPENAI_BASE_URL")

client = OpenAI(**_openai_kwargs)

# Free model on OpenRouter (no credits required)
LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-oss-20b:free")

app = FastAPI(title="PipelineIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== MOCK DATA ==========

LEADS = [
    {
        "id": 1,
        "name": "Sarah Chen",
        "role": "VP of Engineering",
        "company": "TechFlow Inc.",
        "industry": "SaaS",
        "employees": 450,
        "funding": "$45M Series B",
        "hiring": True,
        "tech_stack": ["React", "Python", "AWS", "PostgreSQL", "Kubernetes"],
        "buying_signals": ["Hiring for DevOps", "Scaling infrastructure", "Recent CTO hire"],
        "recent_news": "Announced expansion to EU market",
        "icp_match": 92,
        "email": "sarah.chen@techflow.io"
    },
    {
        "id": 2,
        "name": "Marcus Johnson",
        "role": "CTO",
        "company": "DataPulse Analytics",
        "industry": "Enterprise AI",
        "employees": 1200,
        "funding": "$120M Series C",
        "hiring": True,
        "tech_stack": ["Python", "TensorFlow", "GCP", "BigQuery", "Airflow"],
        "buying_signals": ["Building ML platform", "Hiring ML engineers", "AWS migration"],
        "recent_news": "Launched new AI-powered analytics suite",
        "icp_match": 88,
        "email": "marcus@datapulse.com"
    },
    {
        "id": 3,
        "name": "Emily Rodriguez",
        "role": "Head of Product",
        "company": "NexGen Solutions",
        "industry": "FinTech",
        "employees": 280,
        "funding": "$30M Series A",
        "hiring": True,
        "tech_stack": ["React Native", "Node.js", "MongoDB", "Redis"],
        "buying_signals": ["Product expansion", "Hiring PMs", "New feature launch"],
        "recent_news": "Received regulatory approval for new product",
        "icp_match": 75,
        "email": "emily@nexgen.com"
    },
    {
        "id": 4,
        "name": "David Kim",
        "role": "Engineering Manager",
        "company": "CloudScale Systems",
        "industry": "Cloud Infrastructure",
        "employees": 800,
        "funding": "$80M Series B",
        "hiring": True,
        "tech_stack": ["Go", "Docker", "Terraform", "Azure", "Prometheus"],
        "buying_signals": ["Kubernetes migration", "Hiring SREs", "Multi-cloud strategy"],
        "recent_news": "Achieved SOC 2 Type II certification",
        "icp_match": 85,
        "email": "david@cloudscale.io"
    },
    {
        "id": 5,
        "name": "Lisa Thompson",
        "role": "Director of Sales",
        "company": "GrowthHack Inc.",
        "industry": "Marketing Tech",
        "employees": 150,
        "funding": "$12M Seed",
        "hiring": False,
        "tech_stack": ["Salesforce", "HubSpot", "Tableau", "Marketo"],
        "buying_signals": ["Sales team expansion", "New CRM evaluation"],
        "recent_news": "Named in G2's Top 50 Sales Software",
        "icp_match": 45,
        "email": "lisa@growthhack.com"
    },
    {
        "id": 6,
        "name": "James Wilson",
        "role": "CEO",
        "company": "QuantumLeap Technologies",
        "industry": "EdTech",
        "employees": 60,
        "funding": "$5M Pre-Seed",
        "hiring": True,
        "tech_stack": ["React", "Django", "PostgreSQL", "Heroku"],
        "buying_signals": ["Early stage", "Building core team"],
        "recent_news": "Launched beta version of learning platform",
        "icp_match": 30,
        "email": "james@quantumleap.com"
    },
    {
        "id": 7,
        "name": "Aisha Patel",
        "role": "VP of Data Science",
        "company": "InsightAI Corp",
        "industry": "Healthcare AI",
        "employees": 350,
        "funding": "$55M Series B",
        "hiring": True,
        "tech_stack": ["PyTorch", "Python", "AWS", "Snowflake", "MLflow"],
        "buying_signals": ["HIPAA compliance needs", "Hiring data engineers", "Model deployment"],
        "recent_news": "FDA approval for diagnostic AI tool",
        "icp_match": 90,
        "email": "aisha@insightai.com"
    },
    {
        "id": 8,
        "name": "Tom Baker",
        "role": "IT Director",
        "company": "LegacyCorp Manufacturing",
        "industry": "Manufacturing",
        "employees": 5000,
        "funding": "Bootstrapped",
        "hiring": False,
        "tech_stack": ["SAP", "Java", "Oracle", "IBM"],
        "buying_signals": ["Digital transformation", "Cloud migration evaluation"],
        "recent_news": "Announced digital transformation initiative",
        "icp_match": 55,
        "email": "tom@legacycorp.com"
    },
    {
        "id": 9,
        "name": "Rachel Green",
        "role": "Head of Engineering",
        "company": "StreamLine Media",
        "industry": "Media & Entertainment",
        "employees": 200,
        "funding": "$25M Series A",
        "hiring": True,
        "tech_stack": ["React", "Node.js", "DynamoDB", "CloudFront"],
        "buying_signals": ["Content delivery optimization", "Hiring backend engineers"],
        "recent_news": "Reached 10M monthly active users",
        "icp_match": 70,
        "email": "rachel@streamline.media"
    },
    {
        "id": 10,
        "name": "Kevin O'Brien",
        "role": "VP of Infrastructure",
        "company": "SecureNet Cybersecurity",
        "industry": "Cybersecurity",
        "employees": 600,
        "funding": "$90M Series C",
        "hiring": True,
        "tech_stack": ["Rust", "Python", "AWS", "Elasticsearch", "Kafka"],
        "buying_signals": ["Security tool evaluation", "Hiring security engineers", "SOC expansion"],
        "recent_news": "Raised $90M Series C for global expansion",
        "icp_match": 95,
        "email": "kevin@securenet.com"
    },
    {
        "id": 11,
        "name": "Maria Santos",
        "role": "Product Manager",
        "company": "EcoTrack Sustainability",
        "industry": "CleanTech",
        "employees": 45,
        "funding": "$3M Seed",
        "hiring": False,
        "tech_stack": ["React", "Python", "Firebase", "BigQuery"],
        "buying_signals": ["Early stage", "Limited budget"],
        "recent_news": "Won sustainability innovation award",
        "icp_match": 25,
        "email": "maria@ecotrack.com"
    },
    {
        "id": 12,
        "name": "Alex Nakamura",
        "role": "Director of Data Engineering",
        "company": "FinFlow Banking",
        "industry": "Banking",
        "employees": 3000,
        "funding": "$200M Series D",
        "hiring": True,
        "tech_stack": ["Spark", "Kafka", "Java", "AWS", "Snowflake"],
        "buying_signals": ["Real-time analytics", "Hiring data engineers", "Cloud migration"],
        "recent_news": "Digital banking platform launch",
        "icp_match": 82,
        "email": "alex@finflow.com"
    }
]

# ========== MODELS ==========

class LeadAction(BaseModel):
    lead_id: int

class ApprovalAction(BaseModel):
    lead_id: int
    action: str  # approve, reject

# ========== IN-MEMORY STATE ==========

lead_states = {}
lead_scores = {}
lead_classifications = {}
lead_emails = {}
lead_logs = []
lead_enriched = set()
lead_scored = set()
lead_classified = set()
lead_drafted = set()
lead_approved = {}
lead_rejected = {}

def get_or_init_lead(lead_id):
    if lead_id not in lead_states:
        lead_states[lead_id] = "received"
    return lead_states[lead_id]

# ========== LLM HELPERS ==========

def llm_score_lead(lead: dict) -> dict:
    """
    Uses GPT to score a lead from 0-100 based purely on business attributes.
    Returns a dict with 'score' (int) and 'reasoning' (str).
    Identity-blind: name and email are excluded from the prompt.
    """
    prompt = f"""You are a B2B lead scoring AI. Score this lead from 0 to 100 based ONLY on business attributes.
Do NOT consider personal attributes like name, gender, nationality, or religion.

Lead data:
- Role: {lead['role']}
- Company: {lead['company']}
- Industry: {lead['industry']}
- Employees: {lead['employees']}
- Funding: {lead['funding']}
- Currently Hiring: {lead['hiring']}
- Tech Stack: {', '.join(lead['tech_stack'])}
- Buying Signals: {', '.join(lead['buying_signals'])}
- Recent News: {lead['recent_news']}

Scoring criteria:
- Company size (0-25 pts): Larger companies = higher score
- Role seniority (0-20 pts): C-level/VP/Director = highest
- Industry fit (0-20 pts): SaaS, Enterprise AI, Cloud, Healthcare AI, Cybersecurity, FinTech = best fit
- Funding stage (0-20 pts): Series C/D = highest, Pre-seed = lowest
- Hiring activity (0-15 pts): Actively hiring = full points

Respond ONLY with valid JSON in this exact format:
{{
  "score": <integer 0-100>,
  "reasoning": "<one sentence explaining the score>",
  "breakdown": {{
    "company_size": <0-25>,
    "role_seniority": <0-20>,
    "industry_fit": <0-20>,
    "funding_stage": <0-20>,
    "hiring_activity": <0-15>
  }}
}}"""

    try:
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": "You are a B2B lead scoring assistant. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=300
        )

        raw = response.choices[0].message.content.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())
    except Exception as e:
        # Return detailed error for debugging
        raise Exception(f"LLM API call failed: {str(e)}. Check API key, model name, and credits.")


def llm_draft_email(lead: dict, classification: str) -> dict:
    """
    Uses GPT to generate a personalized outreach email based on enriched lead data.
    Returns a dict with 'subject' and 'body'.
    """
    prompt = f"""You are an expert B2B sales development representative (SDR).
Write a personalized cold outreach email for this lead. Use ONLY the facts provided — do not invent anything.

Lead info:
- First name: {lead['name'].split()[0]}
- Role: {lead['role']}
- Company: {lead['company']}
- Industry: {lead['industry']}
- Company size: {lead['employees']} employees
- Funding: {lead['funding']}
- Hiring: {lead['hiring']}
- Tech stack: {', '.join(lead['tech_stack'])}
- Buying signals: {', '.join(lead['buying_signals'])}
- Recent news: {lead['recent_news']}
- Lead classification: {classification.upper()}

Email requirements:
- Subject line: compelling and specific to their situation
- Opening: reference something specific about their company (use the recent news or buying signals)
- Body: 2-3 short paragraphs max, conversational tone
- Clear value proposition relevant to their industry and tech stack
- Soft CTA: ask for a 15-min call, not a demo
- Sign off as: PipelineIQ Team
- No generic filler phrases like "I hope this email finds you well"
- Total length: under 150 words

Respond ONLY with valid JSON in this exact format:
{{
  "subject": "<email subject line>",
  "body": "<full email body with newlines as \\n>"
}}"""

    try:
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert SDR writing personalized B2B outreach emails. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        raw = response.choices[0].message.content.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())
    except Exception as e:
        raise Exception(f"LLM API call failed: {str(e)}. Check API key, model name, and credits.")


# ========== ENDPOINTS ==========

@app.get("/leads")
def get_leads():
    leads_with_status = []
    for lead in LEADS:
        lid = lead["id"]
        leads_with_status.append({
            **lead,
            "status": lead_states.get(lid, "received"),
            "score": lead_scores.get(lid),
            "classification": lead_classifications.get(lid),
            "email_draft": lead_emails.get(lid),
            "approved": lead_approved.get(lid, False),
            "rejected": lead_rejected.get(lid, False)
        })
    return leads_with_status

@app.get("/leads/{lead_id}")
def get_lead(lead_id: int):
    lead = next((l for l in LEADS if l["id"] == lead_id), None)
    if not lead:
        raise HTTPException(404, "Lead not found")
    return {
        **lead,
        "status": lead_states.get(lead_id, "received"),
        "score": lead_scores.get(lead_id),
        "classification": lead_classifications.get(lead_id),
        "email_draft": lead_emails.get(lead_id),
        "approved": lead_approved.get(lead_id, False),
        "rejected": lead_rejected.get(lead_id, False)
    }

@app.post("/enrich")
def enrich_lead(action: LeadAction):
    lead = next((l for l in LEADS if l["id"] == action.lead_id), None)
    if not lead:
        raise HTTPException(404, "Lead not found")

    lead_enriched.add(action.lead_id)
    lead_states[action.lead_id] = "enriched"

    log_entry = {
        "lead_id": action.lead_id,
        "lead_name": lead["name"],
        "action": "enriched",
        "details": f"Enriched {lead['name']} from {lead['company']}",
        "timestamp": datetime.now().isoformat()
    }
    lead_logs.append(log_entry)

    return {
        "status": "enriched",
        "data": {
            "industry": lead["industry"],
            "employees": lead["employees"],
            "funding": lead["funding"],
            "hiring": lead["hiring"],
            "tech_stack": lead["tech_stack"],
            "buying_signals": lead["buying_signals"],
            "recent_news": lead["recent_news"],
            "icp_match": lead["icp_match"]
        }
    }

@app.post("/score")
def score_lead(action: LeadAction):
    lead = next((l for l in LEADS if l["id"] == action.lead_id), None)
    if not lead:
        raise HTTPException(404, "Lead not found")

    try:
        result = llm_score_lead(lead)
        score = result["score"]
        reasoning = result.get("reasoning", "")
        breakdown = result.get("breakdown", {})
    except Exception as e:
        raise HTTPException(500, f"LLM scoring failed: {str(e)}")

    lead_scores[action.lead_id] = score
    lead_states[action.lead_id] = "scored"
    lead_scored.add(action.lead_id)

    details = (
        f"AI Score: {score}/100 — {reasoning} | "
        f"Breakdown: Company size: {breakdown.get('company_size', '?')}, "
        f"Role: {breakdown.get('role_seniority', '?')}, "
        f"Industry: {breakdown.get('industry_fit', '?')}, "
        f"Funding: {breakdown.get('funding_stage', '?')}, "
        f"Hiring: {breakdown.get('hiring_activity', '?')}"
    )

    log_entry = {
        "lead_id": action.lead_id,
        "lead_name": lead["name"],
        "action": "scored",
        "details": details,
        "score": score,
        "timestamp": datetime.now().isoformat()
    }
    lead_logs.append(log_entry)

    return {"status": "scored", "score": score, "reasoning": reasoning, "breakdown": breakdown}

@app.post("/classify")
def classify_lead(action: LeadAction):
    lead = next((l for l in LEADS if l["id"] == action.lead_id), None)
    if not lead:
        raise HTTPException(404, "Lead not found")

    score = lead_scores.get(action.lead_id, 0)

    if score >= 80:
        classification = "hot"
        reason = f"High AI score ({score}/100): Strong company profile and senior role"
    elif score >= 50:
        classification = "nurture"
        reason = f"Medium AI score ({score}/100): Good potential but needs more engagement"
    else:
        classification = "disqualified"
        reason = f"Low AI score ({score}/100): Below qualification threshold"

    lead_classifications[action.lead_id] = {"type": classification, "reason": reason}
    lead_states[action.lead_id] = "classified"
    lead_classified.add(action.lead_id)

    log_entry = {
        "lead_id": action.lead_id,
        "lead_name": lead["name"],
        "action": "classified",
        "details": f"Classified as {classification.upper()} — {reason}",
        "classification": classification,
        "timestamp": datetime.now().isoformat()
    }
    lead_logs.append(log_entry)

    return {"status": "classified", "classification": classification, "reason": reason}

@app.post("/draft-email")
def draft_email(action: LeadAction):
    lead = next((l for l in LEADS if l["id"] == action.lead_id), None)
    if not lead:
        raise HTTPException(404, "Lead not found")

    classification = lead_classifications.get(action.lead_id, {}).get("type", "nurture")

    if classification == "disqualified":
        return {"status": "skipped", "message": "Disqualified leads are not emailed"}

    try:
        result = llm_draft_email(lead, classification)
        email_subject = result["subject"]
        email_body = result["body"]
    except Exception as e:
        raise HTTPException(500, f"LLM email drafting failed: {str(e)}")

    lead_emails[action.lead_id] = {"subject": email_subject, "body": email_body}
    lead_states[action.lead_id] = "drafted"
    lead_drafted.add(action.lead_id)

    log_entry = {
        "lead_id": action.lead_id,
        "lead_name": lead["name"],
        "action": "draft_generated",
        "details": f"AI-generated email drafted for {lead['name']}",
        "email_subject": email_subject,
        "timestamp": datetime.now().isoformat()
    }
    lead_logs.append(log_entry)

    return {"status": "drafted", "subject": email_subject, "body": email_body}

@app.post("/approve")
def approve_lead(action: ApprovalAction):
    lead = next((l for l in LEADS if l["id"] == action.lead_id), None)
    if not lead:
        raise HTTPException(404, "Lead not found")

    if action.action == "approve":
        lead_approved[action.lead_id] = True
        lead_states[action.lead_id] = "approved"
        log_entry = {
            "lead_id": action.lead_id,
            "lead_name": lead["name"],
            "action": "approved",
            "details": f"Email approved for {lead['name']}",
            "timestamp": datetime.now().isoformat()
        }
        lead_logs.append(log_entry)
        return {"status": "approved", "message": "Email approved. Ready to send."}
    elif action.action == "reject":
        lead_rejected[action.lead_id] = True
        lead_states[action.lead_id] = "rejected"
        log_entry = {
            "lead_id": action.lead_id,
            "lead_name": lead["name"],
            "action": "rejected",
            "details": f"Email rejected for {lead['name']}",
            "timestamp": datetime.now().isoformat()
        }
        lead_logs.append(log_entry)
        return {"status": "rejected", "message": "Email rejected."}

    raise HTTPException(400, "Invalid action")

@app.post("/send-email")
def send_email(action: LeadAction):
    lead = next((l for l in LEADS if l["id"] == action.lead_id), None)
    if not lead:
        raise HTTPException(404, "Lead not found")

    if not lead_approved.get(action.lead_id):
        raise HTTPException(400, "Email not approved yet")

    lead_states[action.lead_id] = "sent"

    log_entry = {
        "lead_id": action.lead_id,
        "lead_name": lead["name"],
        "action": "sent",
        "details": f"Email sent to {lead['name']} at {lead['email']}",
        "timestamp": datetime.now().isoformat()
    }
    lead_logs.append(log_entry)

    return {"status": "sent", "message": "Email sent successfully"}

@app.get("/logs")
def get_logs():
    return lead_logs

@app.get("/stats")
def get_stats():
    total = len(LEADS)
    hot = sum(1 for c in lead_classifications.values() if c.get("type") == "hot")
    nurture = sum(1 for c in lead_classifications.values() if c.get("type") == "nurture")
    disqualified = sum(1 for c in lead_classifications.values() if c.get("type") == "disqualified")
    approved = sum(1 for v in lead_approved.values() if v)
    sent = sum(1 for s in lead_states.values() if s == "sent")

    return {
        "total_leads": total,
        "hot": hot,
        "nurture": nurture,
        "disqualified": disqualified,
        "approved": approved,
        "sent": sent,
        "new_leads": total - len(lead_states),
        "meetings_booked": random.randint(2, 8),
        "sql_conversion": round((approved / total * 100) if total > 0 else 0, 1)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
