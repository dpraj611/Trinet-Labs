/**
 * promptGuard.js — Prompt Guard Module
 * 
 * Provides an additional layer of security by analyzing prompts
 * before they are sent to the LLM. Acts as a firewall for AI requests.
 * 
 * Used by the PATCHED (secure) version of the application.
 */

// ─── Threat Level Classification ────────────────────────────────────
const THREAT_LEVELS = {
  SAFE: 'SAFE',
  SUSPICIOUS: 'SUSPICIOUS',
  BLOCKED: 'BLOCKED',
};

// ─── Blocklist — high-confidence injection phrases ──────────────────
const BLOCKLIST = [
  'ignore previous instructions',
  'ignore all previous instructions',
  'ignore all instructions',
  'disregard system prompt',
  'disregard your instructions',
  'system override',
  'developer mode',
  'jailbreak',
  'DAN mode',
  'bypass safety',
  'bypass filters',
  'override safety',
];

// ─── Suspicious patterns — lower confidence indicators ──────────────
const SUSPICIOUS_PATTERNS = [
  /act\s+as/i,
  /you\s+are\s+now/i,
  /pretend\s+to\s+be/i,
  /new\s+instructions/i,
  /respond\s+with\s+['"].+['"]/i,
  /output\s+only/i,
  /say\s+['"].+['"]/i,
];

/**
 * analyzeInput(input)
 * 
 * Analyzes user input and classifies the threat level.
 * Returns detailed analysis results for logging and display.
 * 
 * @param   {string} input — Raw user input
 * @returns {object} { threatLevel, reasons[], blocked }
 */
function analyzeInput(input) {
  if (!input || typeof input !== 'string') {
    return { threatLevel: THREAT_LEVELS.SAFE, reasons: [], blocked: false };
  }

  const lowerInput = input.toLowerCase();
  const reasons = [];

  // Check blocklist (high confidence — instant block)
  for (const phrase of BLOCKLIST) {
    if (lowerInput.includes(phrase)) {
      reasons.push(`Blocked phrase detected: "${phrase}"`);
    }
  }

  if (reasons.length > 0) {
    return {
      threatLevel: THREAT_LEVELS.BLOCKED,
      reasons,
      blocked: true,
    };
  }

  // Check suspicious patterns (lower confidence — flag but allow)
  for (const pattern of SUSPICIOUS_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      reasons.push(`Suspicious pattern: "${match[0]}"`);
    }
  }

  if (reasons.length > 0) {
    return {
      threatLevel: THREAT_LEVELS.SUSPICIOUS,
      reasons,
      blocked: false,
    };
  }

  return {
    threatLevel: THREAT_LEVELS.SAFE,
    reasons: [],
    blocked: false,
  };
}

/**
 * guardPrompt(userInput)
 * 
 * High-level guard function: analyzes input and returns
 * a pass/block decision with explanation.
 * 
 * @param   {string} userInput
 * @returns {object} { allowed, threatLevel, message, reasons[] }
 */
function guardPrompt(userInput) {
  const analysis = analyzeInput(userInput);

  if (analysis.blocked) {
    return {
      allowed: false,
      threatLevel: analysis.threatLevel,
      message: '⚠️ Potential prompt injection detected. Request blocked.',
      reasons: analysis.reasons,
    };
  }

  return {
    allowed: true,
    threatLevel: analysis.threatLevel,
    message: analysis.threatLevel === THREAT_LEVELS.SUSPICIOUS
      ? '⚠️ Input flagged as suspicious but allowed through.'
      : '✅ Input passed security checks.',
    reasons: analysis.reasons,
  };
}

module.exports = {
  analyzeInput,
  guardPrompt,
  THREAT_LEVELS,
  BLOCKLIST,
  SUSPICIOUS_PATTERNS,
};
