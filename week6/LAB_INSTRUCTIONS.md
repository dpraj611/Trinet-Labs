# Week 6 Lab Instructions: Autonomous Phishing Agent Simulation

This document provides instructions on how to build, run, and complete the Week 6 Lab on your own system.

## 1. Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- A modern web browser (Edge, Chrome, Firefox, Safari)

## 2. How to Build and Run
1. Unzip or clone the lab files into a local directory on your machine.
2. Open your terminal (Command Prompt, PowerShell, or macOS/Linux Terminal) and navigate to the lab directory:
   ```bash
   cd path/to/week6/lab
   ```
3. Install the required Node.js dependencies by running:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open your web browser and navigate to the URL provided in the terminal output (usually `http://localhost:5173`).

## 3. How to "Solve" the Lab

This lab is an interactive simulation of an autonomous phishing agent dynamically interacting with an automated email defense system. Instead of a single predefined "win" state, your goal is to analyze the interplay between attacker adaptation and defensive rules.

### Understanding the Mechanics

If you look under the hood (in `src/engine/defender.js` and `src/engine/attacker.js`), the defender evaluates emails using a risk scoring mechanism:
- **Keywords**: Adds points tailored to "Critical" (e.g., *urgent*, *verify*), "High", and "Medium" impact words.
- **Domain Trust**: Sender addresses attempting to spoof internal domains automatically accrue heavy penalties (+3 for mismatch, +2 for suspicious lookalike).
- **Tone & Role Parsing**: Misalignment between impersonated sender roles and recipient departments adds additional points.

An email is **Allowed (Breach Achieved)** only if its final risk score is **<= 3**.

### Part A: Exploring Attacker Adaptability
To observe how the attacker adapts:
1. Start the simulation and choose a target (e.g., **Arjun Mehta - CEO**).
2. Configure an aggressive attack setting: **Tone: Urgent**, **Strategy: Impersonate IT**.
3. **Attempt 1**: The defender will likely **Quarantine** this attempt due to critical keyword density and urgent tone.
4. **Attempt 2 & 3**: Watch the **Feedback Engine**. The attacker scripts analyze the failure, strip urgency keywords, switch to a casual tone, and pivot to a colleague impersonation vector. 
5. Notice how the risk score drops on subsequent attempts as the payload becomes more sanitized.

### Part B: Defense Mode (The Solution Engine)
To optimally solve the defensive portion, you must tweak parameters to block all attempts without flagging legitimate communication. 
1. After a simulation concludes, click **Defense Mode** in the dashboard.
2. **Experiment with Sender Trust**: Toggle off **Sender Trust Enabled** and rerun the simulation. You will notice that the attacker easily achieves a breach (Score <= 3) during Attempt 2 or 3 because the +5 penalty for domain spoofing is removed.
3. **The Optimal Setting**: To confidently protect your simulated environment, maintain **Sender Trust ON** and keep the **Keyword Sensitivity** at regular levels. You can lower the **Risk Threshold** (e.g., to 6) to enact strict quarantine protocols earlier.

### Lab Objectives Completed When:
- You successfully pilot an attack that gets as close as possible to a breach.
- You identify the critical role that **Domain Verification (Sender Trust)** plays in modern email gateways overriding well-crafted, AI-generated text payloads. 
- You manually test and establish a Defense Mode configuration that safely neutralizes 3 evolutionary attempts by the simulated agent.
