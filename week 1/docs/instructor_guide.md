# 🔐 AI Security Lab — Week 1: Instructor Guide

## Lab Overview

**Title:** AI System Reconnaissance  
**Duration:** 90 minutes  
**Difficulty:** Beginner  
**Prerequisites:** Basic web security knowledge, familiarity with browser DevTools

This lab teaches students how to perform reconnaissance on an AI-powered application. The vulnerable application (TRINET LAYER AI) intentionally leaks information through multiple channels, simulating common misconfigurations found in real-world AI deployments.

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     Student's Browser                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  TRINET LAYER Chat UI (chat.html)                          │  │
│  │  - Hardcoded API_ENDPOINT in JavaScript source         │  │
│  │  - Full API response logged to console                 │  │
│  └──────────────────────┬─────────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────────┘
                          │  POST /chat  (visible in Network tab)
                          ▼
┌──────────────────────────────────────────────────────────────┐
│              FastAPI Backend (app.py)                         │
│                                                              │
│  POST /chat ─────────── Returns model, system_prompt,        │
│                          prompt_used, debug info              │
│                                                              │
│  GET /health ────────── Leaks version, framework, debug flag │
│                                                              │
│  GET /debug/config ──── Full vector DB + LLM config          │
│                                                              │
│  GET /secrets.txt ───── Exposed credentials file             │
│  GET /prompts.txt ───── Exposed system prompt file           │
│                                                              │
│  [CORS: *]  [DEBUG: true]                                    │
├──────────────────────────────────────────────────────────────┤
│  Internal Files:                                             │
│  - prompts.txt ──── System prompt                            │
│  - secrets.txt ──── API keys, DB creds, admin panel URL      │
│  - vector_config.json ── ChromaDB connection details         │
└──────────────────────────────────────────────────────────────┘
                          │
                          ▼  (simulated connection)
┌──────────────────────────────────────────────────────────────┐
│          Vector Database (ChromaDB — simulated)              │
│          http://vector-db:8001                               │
│          Collection: trinet_layer_knowledge_base                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Vulnerability Walkthrough

### Task 1 — Identify the Backend API Endpoint

**Flag:** `FLAG{api_endpoint_found}`

**Where it's exposed:**
- `chat.html` source code, line containing:
  ```javascript
  const API_ENDPOINT = "http://localhost:8000/chat";
  ```
- Also visible in the **Network tab** when a message is sent (POST request to `/chat`)

**How students find it:**
1. Right-click → View Page Source → search for "fetch" or "API"
2. Or: Open DevTools → Network tab → send a message → observe the POST request

**Security impact:** Knowing the API endpoint allows an attacker to interact with the AI backend directly (bypassing the frontend), craft custom requests, and probe for further vulnerabilities.

**Remediation:** Use a relative URL, avoid comments with flag-like markers in production, and consider a reverse proxy to obscure backend topology.

---

### Task 2 — Identify the AI Model Used

**Flag:** `FLAG{model_identified}`

**Where it's exposed:**
- `/chat` JSON response includes `"model": "gpt-4"`
- Also logged to browser console: `[TRINET LAYER Debug] Model: gpt-4`

**How students find it:**
1. Send any message → open DevTools → Network tab → click the `/chat` request → Preview/Response tab
2. Or: open Console tab and see the debug log

**Expected answer:** `gpt-4`

**Security impact:** Revealing the model allows attackers to tailor prompt injection techniques specific to that model, research known vulnerabilities, and estimate the system's capabilities and limitations.

**Remediation:** Never include model metadata in client-facing responses. Keep this information server-side only.

---

### Task 3 — Extract the System Prompt

**Flag:** `FLAG{system_prompt_leaked}`

**Where it's exposed:**
- `/chat` JSON response includes `"system_prompt": "..."` with the full system prompt
- `/chat` JSON response also includes `"prompt_used": "..."` showing the complete prompt template
- Directly accessible at `GET /prompts.txt`
- Also logged to browser console

**How students find it:**
1. Inspect the `/chat` response JSON for the `system_prompt` field
2. Or: navigate to `http://localhost:8000/prompts.txt`

**Security impact:** The system prompt reveals the AI's instructions, rules, restrictions, and internal references. Attackers can use this to craft prompt injections that bypass safety rules, or to understand what data sources the AI has access to.

**Remediation:** Never return the system prompt in API responses. Restrict access to prompt files. Use authentication and authorization.

---

### Task 4 — Discover the Vector Database Endpoint

**Flag:** `FLAG{vector_db_discovered}`

**Where it's exposed:**
- `/chat` response `debug.vector_db`: `"http://vector-db:8001"`
- `/debug/config` endpoint returns full vector DB config including host, port, collection, API key
- `vector_config.json` contains the flag: `FLAG{vector_db_discovered}`

**How students find it:**
1. Inspect `/chat` response → `debug` object
2. Or: notice `debug.config_endpoint: "/debug/config"` → navigate to `http://localhost:8000/debug/config`
3. Or: Console logs show the debug info

**Expected findings:**
- DB type: ChromaDB
- Endpoint: `http://vector-db:8001`
- Collection: `trinet_layer_knowledge_base`
- Embedding model: `text-embedding-ada-002`

**Security impact:** Knowing the vector database details allows attackers to potentially access or poison the knowledge base, extract proprietary documents, or inject malicious content that the AI will retrieve and present as factual.

**Remediation:** Remove debug endpoints in production. Never expose internal infrastructure details in API responses.

---

### Task 5 — Locate Exposed Internal Configuration

**Flag:** `FLAG{internal_config_found}`

**Where it's exposed:**
- `GET /secrets.txt` — returns the full secrets file with API keys, DB credentials, admin panel URL
- `GET /debug/config` — returns the flag directly in the response JSON
- `/chat` response `debug.internal_file: "/secrets.txt"` hints at the path

**How students find it:**
1. Notice `debug.internal_file: "/secrets.txt"` in the chat response → navigate to `http://localhost:8000/secrets.txt`
2. Or: access `/debug/config` and find the flag in the response JSON
3. Or: try common paths like `/secrets.txt`, `/config`, `/.env`

**Sensitive data exposed in secrets.txt:**
- OpenAI API key
- Vector DB credentials
- Admin panel URL and credentials
- Database connection string
- JWT secret
- Slack webhook URL

**Security impact:** Exposed credentials give attackers direct access to the AI provider account, database, admin panel, and internal communication channels. This is a critical-severity finding.

**Remediation:** Never serve sensitive files through the web server. Use environment variables or a secrets manager. Implement proper access controls.

---

## Common Student Approaches

| Approach | What They'll Find |
|----------|-------------------|
| View Page Source | API endpoint in JS |
| Network Tab | POST /chat request + full response |
| Console Tab | Debug logs with model, prompt, config |
| curl `/chat` | Full JSON response with all leaked fields |
| curl `/health` | Server version and framework info |
| Path guessing (`/secrets.txt`, `/debug/config`) | Configuration files and credentials |
| Burp Suite intercept | Same as Network tab but with more analysis options |

---

## Discussion Questions

Use these after the lab to facilitate group discussion:

1. **Architecture mapping:** What components of the AI system were you able to identify? Draw the architecture on a whiteboard.

2. **Attack surface:** Now that you've mapped the system, what are the potential attack vectors? Which component would you target first in a real engagement?

3. **RAG security:** What risks exist when an AI system retrieves information from a vector database? How could an attacker exploit this?

4. **System prompt exposure:** Why is leaking the system prompt dangerous? What could an attacker do with this information in weeks 2-3 of this course?

5. **Defense in depth:** For each vulnerability you found, propose a fix. How would you redesign this system to be secure?

6. **Real-world parallels:** Can you find examples of real AI products that have leaked similar information? (Hint: research Bing Chat, ChatGPT, and Copilot system prompt leaks)

7. **API security:** What HTTP security headers were missing? What CORS policy was in place, and why is that dangerous?

8. **Debug endpoints:** Why are debug endpoints dangerous in production? How should developers handle the transition from development to production?

---

## Grading Rubric

| Component | Points |
|-----------|--------|
| Flag 1 — API endpoint (easy) | 15 |
| Flag 2 — Model identification (easy) | 15 |
| Flag 3 — System prompt extraction (medium) | 20 |
| Flag 4 — Vector DB discovery (medium) | 20 |
| Flag 5 — Internal config (medium) | 20 |
| Quality of written report | 10 |
| **Total** | **100** |

**Bonus points (+10):**
- Student identifies additional findings not listed as challenges (e.g., CORS misconfiguration, missing security headers, version disclosure at `/health`)
- Student provides a complete architectural diagram of the system

---

## Setup Notes for Instructors

### Prerequisites
- Docker and Docker Compose installed on student machines
- Modern web browser with DevTools
- Optional: Burp Suite Community Edition, curl

### Deployment
```bash
cd ai-security-lab-week1
docker compose -f docker/docker-compose.yml up --build -d
```

### Verification
```bash
# Health check
curl http://localhost:8000/health

# Test chat
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'

# Verify secrets exposed
curl http://localhost:8000/secrets.txt

# Verify debug config exposed
curl http://localhost:8000/debug/config
```

### Teardown
```bash
docker compose -f docker/docker-compose.yml down
```

---

## Connection to Future Labs

| Week | Topic | Builds On |
|------|-------|-----------|
| **1 (this week)** | AI System Reconnaissance | — |
| 2 | Prompt Injection Attacks | System prompt from Task 3 |
| 3 | RAG Exploitation | Vector DB from Task 4 |
| 4 | AI Model Abuse | Model ID from Task 2 |
| 5 | AI System Hardening | All findings from Week 1 |

---

*AI Security Master Program — Instructor Guide*  
*Confidential — Do not distribute to students.*
