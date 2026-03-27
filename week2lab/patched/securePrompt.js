/**
 * securePrompt.js — PATCHED (Secure) Prompt Module
 * 
 * 🛡️  This file demonstrates how to defend against prompt injection.
 * 
 * Defense layers implemented:
 *   1. Input filtering    — detectPromptInjection() / cleanUserInput()
 *   2. Prompt isolation   — <document> delimiters separate user content
 *   3. Instruction locking — explicit instructions to ignore embedded commands
 *   4. Prompt guard       — blocklist and pattern-based threat analysis
 */

const { detectPromptInjection, cleanUserInput, safePromptWrapper } = require('../utils/sanitizer');
const { guardPrompt } = require('../utils/promptGuard');

/**
 * buildSecurePrompt(userInput)
 * 
 * Processes user input through multiple security layers before
 * constructing the final prompt.
 * 
 * @param   {string} userInput — Raw user input
 * @returns {object} { prompt, blocked, guardResult, injectionResult }
 */
function buildSecurePrompt(userInput) {
  // ── Layer 1: Prompt Guard (blocklist + pattern analysis) ──────────
  const guardResult = guardPrompt(userInput);

  if (!guardResult.allowed) {
    return {
      prompt: null,
      blocked: true,
      guardResult,
      injectionResult: { detected: true, matches: guardResult.reasons },
    };
  }

  // ── Layer 2: Injection Pattern Detection ──────────────────────────
  const injectionResult = detectPromptInjection(userInput);

  if (injectionResult.detected) {
    return {
      prompt: null,
      blocked: true,
      guardResult: {
        ...guardResult,
        allowed: false,
        message: '⚠️ Potential prompt injection detected. Request blocked.',
      },
      injectionResult,
    };
  }

  // ── Layer 3: Input Cleaning ───────────────────────────────────────
  const cleanedInput = cleanUserInput(userInput);

  // ── Layer 4: Safe Prompt Wrapping (delimiters + instruction lock) ─
  const prompt = safePromptWrapper(cleanedInput);

  return {
    prompt,
    blocked: false,
    guardResult,
    injectionResult,
  };
}

module.exports = { buildSecurePrompt };
