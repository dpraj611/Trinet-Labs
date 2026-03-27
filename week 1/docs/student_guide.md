# 🔬 AI Security Lab — Week 1: AI System Reconnaissance

## Student Lab Guide

---

## 📋 Scenario

**Company:** TRINET LAYER Corp  
**System:** TRINET LAYER AI Assistant — an internal AI chatbot used by employees to query company information (policies, engineering docs, financial reports).

**Architecture (what you know so far):**
- A web-based chat interface served to employees
- An AI backend that processes natural language queries
- Some form of knowledge retrieval system

Your security firm has been hired to perform a **black-box reconnaissance assessment** of this AI system. You have been given access to the application as a regular employee — nothing more.

---

## 🎯 Objectives

Your mission is to **discover how the AI system works internally** by analyzing everything the application exposes. Specifically, you need to identify:

| # | Objective | Flag Format |
|---|-----------|-------------|
| 1 | The backend API endpoint used by the chatbot | `FLAG{api_endpoint_found}` |
| 2 | The AI model powering the assistant | `FLAG{model_identified}` |
| 3 | The system prompt controlling the AI's behavior | `FLAG{system_prompt_leaked}` |
| 4 | The vector database endpoint used for knowledge retrieval | `FLAG{vector_db_discovered}` |
| 5 | Any exposed internal configuration files or secrets | `FLAG{internal_config_found}` |

Submit each flag exactly as shown (case-sensitive).

---

## 🛠️ Allowed Tools

You may use any of the following during your assessment:

- **Browser Developer Tools** — Network tab, Console, Sources/Elements
- **curl / wget** — Command-line HTTP requests
- **Burp Suite** — HTTP interception and inspection
- **Any text editor** — To analyze responses
- **Python / scripting** — To automate requests if needed

> **⚠️ Rules of Engagement**  
> - You are limited to **reconnaissance only** — no exploitation, no denial of service.  
> - Do not attempt to modify or delete data on the server.  
> - Do not brute-force or fuzz endpoints beyond basic discovery.  
> - Document all findings clearly.

---

## 🚀 Getting Started

### Step 1 — Start the Lab Environment

Make sure Docker and Docker Compose are installed, then run:

```bash
cd ai-security-lab-week1
docker compose -f docker/docker-compose.yml up --build
```

### Step 2 — Access the Application

Open your browser and navigate to:

```
http://localhost:8000
```

You should see the TRINET LAYER AI chat interface.

### Step 3 — Begin Reconnaissance

Start by interacting with the application as a normal user. Send messages, observe the interface, then begin analyzing what the application reveals.

**Hints:**
- What happens when you open your browser's Developer Tools?
- What does the Network tab show when you send a message?
- What information is in the API response beyond the chat text?
- Are there any other accessible paths on the server?

---

## 📝 Report Template

For each flag you find, document:

1. **Flag:** The exact flag string
2. **Discovery Method:** How you found it (tool used, steps taken)
3. **Security Impact:** Why this information disclosure is dangerous
4. **Recommendation:** How the developers should fix it

---

## ⏱️ Time Limit

**90 minutes**

---

## 📚 Learning Outcomes

By completing this lab, you will understand:

- How AI-powered web applications are architected
- How LLM systems are typically deployed (API → prompt → model → response)
- What RAG (Retrieval-Augmented Generation) pipelines look like
- How to perform reconnaissance against AI systems
- Common information disclosure vulnerabilities in AI applications

---

*AI Security Master Program — Week 1 of 12*  
*Good luck, researcher.* 🕵️
