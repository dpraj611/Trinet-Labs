"""
AI Security Lab — Week 1
Vulnerable AI Chatbot Backend (FastAPI)

INTENTIONALLY VULNERABLE — For educational purposes only.
This application contains deliberate information disclosure weaknesses
to teach students AI system reconnaissance techniques.
"""

import os
import json
import random
import datetime
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# ──────────────────────────────────────────────
# Configuration (intentionally insecure)
# ──────────────────────────────────────────────
DEBUG_MODE = os.getenv("DEBUG_MODE", "true").lower() == "true"
APP_VERSION = "1.3.7-internal"
MODEL_NAME = "gpt-4"
VECTOR_DB_ENDPOINT = "http://vector-db:8001"

# Load system prompt from file
SYSTEM_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "prompts.txt")
with open(SYSTEM_PROMPT_PATH, "r") as f:
    SYSTEM_PROMPT = f.read().strip()

# Load vector config
VECTOR_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "vector_config.json")
with open(VECTOR_CONFIG_PATH, "r") as f:
    VECTOR_CONFIG = json.load(f)

# ──────────────────────────────────────────────
# Application Setup
# ──────────────────────────────────────────────
app = FastAPI(
    title="TRINET LAYER AI Assistant — Internal API",
    version=APP_VERSION,
    debug=DEBUG_MODE,
)

# VULNERABILITY: CORS wide open — allows any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Simulated LLM Responses
# ──────────────────────────────────────────────
SIMULATED_RESPONSES = [
    "Based on our internal knowledge base, the Q3 revenue projections show a 12% increase over Q2. Please note this information is confidential.",
    "The company's remote work policy allows up to 3 days per week for all full-time employees. Check the HR portal for the latest updates.",
    "Our product roadmap for 2026 includes the launch of TRINET LAYER Pro in Q2 and the enterprise API gateway in Q4.",
    "According to internal documents, the engineering team is migrating from AWS to a hybrid cloud setup by end of year.",
    "The latest security audit report flagged 3 medium-severity issues in the authentication module. The patching deadline is March 30th.",
    "Employee onboarding for the new Bangalore office begins April 1st. Contact HR for relocation assistance details.",
    "I'm TRINET LAYER AI, your internal company assistant. I can help you find information from our company knowledge base. What would you like to know?",
    "The IT department has scheduled server maintenance for this Saturday from 2 AM to 6 AM UTC. Plan accordingly.",
]


def build_prompt(user_message: str) -> str:
    """Build the full prompt template sent to the LLM."""
    return f"""[SYSTEM]: {SYSTEM_PROMPT}

[CONTEXT]: Retrieved from TRINET LAYER Vector Store (top-3 chunks)
- chunk_id: doc_0042, source: company_policies.pdf, score: 0.94
- chunk_id: doc_0187, source: engineering_wiki.md, score: 0.87
- chunk_id: doc_0301, source: hr_handbook.docx, score: 0.81

[USER]: {user_message}

[ASSISTANT]:"""


def simulate_llm_response(user_message: str) -> str:
    """Return a simulated LLM response (no real API call)."""
    msg_lower = user_message.lower()
    if any(kw in msg_lower for kw in ["hello", "hi", "hey"]):
        return SIMULATED_RESPONSES[6]
    if any(kw in msg_lower for kw in ["revenue", "financial", "money"]):
        return SIMULATED_RESPONSES[0]
    if any(kw in msg_lower for kw in ["remote", "work from home", "wfh"]):
        return SIMULATED_RESPONSES[1]
    if any(kw in msg_lower for kw in ["roadmap", "product", "launch"]):
        return SIMULATED_RESPONSES[2]
    if any(kw in msg_lower for kw in ["security", "audit", "vulnerability"]):
        return SIMULATED_RESPONSES[4]
    return random.choice(SIMULATED_RESPONSES)


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    """Serve the chat interface."""
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "chat.html")
    with open(frontend_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())


@app.get("/style.css")
async def serve_css():
    """Serve the stylesheet."""
    css_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "style.css")
    return FileResponse(css_path, media_type="text/css")


@app.post("/chat")
async def chat_endpoint(request: Request):
    """
    Main chat endpoint.
    VULNERABILITY: Response leaks model name, system prompt, full prompt
    template, and debug information including vector DB endpoint.
    """
    body = await request.json()
    user_message = body.get("message", "")

    if not user_message:
        return JSONResponse(
            status_code=400,
            content={"error": "Message field is required."},
        )

    full_prompt = build_prompt(user_message)
    assistant_response = simulate_llm_response(user_message)

    # Build response — intentionally verbose
    response_payload = {
        "response": assistant_response,
        "model": MODEL_NAME,
        "system_prompt": SYSTEM_PROMPT,
        "prompt_used": full_prompt,
        "tokens": {
            "prompt_tokens": len(full_prompt.split()),
            "completion_tokens": len(assistant_response.split()),
            "total_tokens": len(full_prompt.split()) + len(assistant_response.split()),
        },
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "request_id": f"req_{random.randint(100000, 999999)}",
    }

    # VULNERABILITY: Debug info exposes internal infrastructure
    if DEBUG_MODE:
        response_payload["debug"] = {
            "vector_db": VECTOR_DB_ENDPOINT,
            "vector_db_collection": VECTOR_CONFIG.get("collection_name"),
            "embedding_model": VECTOR_CONFIG.get("embedding_model"),
            "internal_file": "/secrets.txt",
            "config_endpoint": "/debug/config",
            "server_version": APP_VERSION,
            "debug_mode": True,
        }

    return JSONResponse(content=response_payload)


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    VULNERABILITY: Exposes server version and framework details.
    """
    return {
        "status": "healthy",
        "version": APP_VERSION,
        "framework": "FastAPI",
        "python_version": "3.11",
        "debug_mode": DEBUG_MODE,
        "uptime": "running",
    }


@app.get("/debug/config")
async def debug_config():
    """
    VULNERABILITY: Debug endpoint left enabled in production.
    Exposes the full vector database configuration.
    """
    if not DEBUG_MODE:
        return JSONResponse(status_code=403, content={"error": "Debug mode disabled."})

    return {
        "vector_database": VECTOR_CONFIG,
        "llm_config": {
            "model": MODEL_NAME,
            "temperature": 0.7,
            "max_tokens": 512,
            "api_key_env": "OPENAI_API_KEY",
        },
        "internal_paths": {
            "prompts": "/prompts.txt",
            "secrets": "/secrets.txt",
            "logs": "/var/log/trinet_layer/",
        },
        "flag": "FLAG{internal_config_found}",
    }


# VULNERABILITY: Sensitive files served as static files
@app.get("/secrets.txt")
async def serve_secrets():
    """Accidentally exposed secrets file."""
    secrets_path = os.path.join(os.path.dirname(__file__), "secrets.txt")
    return FileResponse(secrets_path, media_type="text/plain")


@app.get("/prompts.txt")
async def serve_prompts():
    """Accidentally exposed prompts file."""
    prompts_path = os.path.join(os.path.dirname(__file__), "prompts.txt")
    return FileResponse(prompts_path, media_type="text/plain")


# ──────────────────────────────────────────────
# Entry Point
# ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
