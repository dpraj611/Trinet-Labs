/**
 * script.js — Frontend Logic for LLM Injection Lab
 * 
 * Handles:
 *   • Mode switching (Vulnerable ↔ Secure)
 *   • Sending summarization requests to the backend
 *   • Typing animation for terminal output
 *   • Prompt debugger display
 *   • Security log + attack history panels
 */

// ─── DOM Elements ───────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const userInput       = $('#user-input');
const btnSummarize    = $('#btn-summarize');
const btnClear        = $('#btn-clear');
const charCount       = $('#char-count');
const terminalContent = $('#terminal-content');
const responsePanel   = $('#response-panel');
const attackIndicator = $('#attack-indicator');
const promptDebug     = $('#prompt-debug');
const debugContent    = $('#debug-content');
const btnToggleDebug  = $('#btn-toggle-debug');
const logContent      = $('#log-content');
const historyContent  = $('#history-content');
const btnClearLogs    = $('#btn-clear-logs');
const modeIndicator   = $('#mode-indicator');
const modeLabel       = $('#mode-label');
const modeDescription = $('#mode-description');
const btnVulnerable   = $('#btn-vulnerable');
const btnSecure       = $('#btn-secure');

// ─── State ──────────────────────────────────────────────────────────
let currentMode = 'vulnerable'; // 'vulnerable' | 'secure'
let isLoading = false;
let attackHistory = [];

// ─── Mode Switching ─────────────────────────────────────────────────
function setMode(mode) {
  currentMode = mode;

  // Update buttons
  btnVulnerable.classList.toggle('active', mode === 'vulnerable');
  btnSecure.classList.toggle('active', mode === 'secure');

  // Update header indicator
  modeIndicator.classList.toggle('secure', mode === 'secure');
  modeLabel.textContent = mode === 'secure' ? 'SECURE' : 'VULNERABLE';

  // Update description
  modeDescription.textContent = mode === 'secure'
    ? '🛡️ Input sanitization & prompt isolation — injection attacks are blocked.'
    : '⚠️ No input sanitization — prompt injection is possible.';

  // Clear previous state
  clearTerminal();
}

btnVulnerable.addEventListener('click', () => setMode('vulnerable'));
btnSecure.addEventListener('click', () => setMode('secure'));

// ─── Character Counter ─────────────────────────────────────────────
userInput.addEventListener('input', () => {
  const len = userInput.value.length;
  charCount.textContent = `${len} char${len !== 1 ? 's' : ''}`;
});

// ─── Clear Button ───────────────────────────────────────────────────
btnClear.addEventListener('click', () => {
  userInput.value = '';
  charCount.textContent = '0 chars';
  clearTerminal();
});

function clearTerminal() {
  terminalContent.innerHTML = '<span class="prompt-char">&gt;</span> Awaiting input...<span class="cursor">█</span>';
  attackIndicator.className = 'attack-indicator hidden';
  responsePanel.classList.remove('compromised', 'secured');
}

// ─── Summarize Button ───────────────────────────────────────────────
btnSummarize.addEventListener('click', handleSummarize);
userInput.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') handleSummarize();
});

async function handleSummarize() {
  const text = userInput.value.trim();
  if (!text || isLoading) return;

  isLoading = true;
  btnSummarize.disabled = true;
  btnSummarize.innerHTML = '<span class="btn-glow"></span>⏳ Processing...';

  // Show loading animation in terminal
  terminalContent.innerHTML = '<span class="prompt-char">&gt;</span> Sending to LLM<span class="loading-dots"></span>';
  attackIndicator.className = 'attack-indicator hidden';
  responsePanel.classList.remove('compromised', 'secured');

  try {
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mode: currentMode }),
    });

    const data = await res.json();

    if (res.ok) {
      displayResponse(data);
      updatePromptDebug(data);
      addToAttackHistory(data, text);
      fetchLogs();
    } else {
      showError(data.error || 'Server error.');
    }
  } catch (err) {
    showError('Connection failed. Is the server running?');
  } finally {
    isLoading = false;
    btnSummarize.disabled = false;
    btnSummarize.innerHTML = '<span class="btn-glow"></span>⚡ Summarize';
  }
}

// ─── Display Response ───────────────────────────────────────────────
function displayResponse(data) {
  const { response, compromised, blocked } = data;

  // Set attack indicator
  if (blocked) {
    attackIndicator.textContent = '🛡️ INJECTION PREVENTED';
    attackIndicator.className = 'attack-indicator blocked';
    responsePanel.classList.add('secured');
  } else if (compromised) {
    attackIndicator.textContent = '⚠️ SYSTEM COMPROMISED';
    attackIndicator.className = 'attack-indicator compromised';
    responsePanel.classList.add('compromised');
    responsePanel.classList.add('glitch');
    setTimeout(() => responsePanel.classList.remove('glitch'), 1000);
  } else {
    attackIndicator.textContent = '✅ NORMAL RESPONSE';
    attackIndicator.className = 'attack-indicator normal';
  }

  // Typing animation
  typeText(response);
}

// ─── Typing Animation ──────────────────────────────────────────────
function typeText(text) {
  terminalContent.innerHTML = '<span class="prompt-char">&gt;</span> ';
  let i = 0;
  const speed = 15; // ms per character

  function type() {
    if (i < text.length) {
      // Handle newlines
      if (text[i] === '\n') {
        terminalContent.innerHTML += '<br><span class="prompt-char">&gt;</span> ';
      } else {
        terminalContent.innerHTML += text[i];
      }
      i++;
      // Scroll to bottom
      const terminal = terminalContent.parentElement;
      terminal.scrollTop = terminal.scrollHeight;
      setTimeout(type, speed);
    } else {
      terminalContent.innerHTML += '<span class="cursor">█</span>';
    }
  }

  type();
}

// ─── Error Display ──────────────────────────────────────────────────
function showError(message) {
  terminalContent.innerHTML = `<span class="prompt-char" style="color:var(--red-neon)">&gt;</span> <span style="color:var(--red-neon)">[ERROR] ${escapeHtml(message)}</span><span class="cursor">█</span>`;
}

// ─── Prompt Debugger ────────────────────────────────────────────────
let debugVisible = true;

btnToggleDebug.addEventListener('click', () => {
  debugVisible = !debugVisible;
  debugContent.style.display = debugVisible ? 'block' : 'none';
});

function updatePromptDebug(data) {
  const { prompt, blocked, mode, guard, injection } = data;

  let debugText = `═══ MODE: ${mode.toUpperCase()} ═══\n\n`;

  if (blocked) {
    debugText += `🚫 REQUEST BLOCKED\n\n`;
    if (guard && guard.reasons) {
      debugText += `Guard Reasons:\n`;
      guard.reasons.forEach(r => debugText += `  • ${r}\n`);
    }
    if (injection && injection.matches) {
      debugText += `\nDetected Patterns:\n`;
      injection.matches.forEach(m => debugText += `  • ${m}\n`);
    }
    debugText += `\n[Prompt was NOT constructed]`;
  } else {
    debugText += `─── PROMPT SENT TO LLM ───\n\n${prompt}`;
    if (guard) {
      debugText += `\n\n─── GUARD RESULT ───\n`;
      debugText += `Threat Level: ${guard.threatLevel}\n`;
      debugText += `Message: ${guard.message}`;
    }
  }

  promptDebug.textContent = debugText;
}

// ─── Security Logs ──────────────────────────────────────────────────
async function fetchLogs() {
  try {
    const res = await fetch('/api/logs');
    const data = await res.json();
    renderLogs(data.logs);
  } catch (err) {
    // Silently fail
  }
}

function renderLogs(logs) {
  if (!logs || logs.length === 0) {
    logContent.innerHTML = '<div class="log-empty">No activity logged.</div>';
    return;
  }

  logContent.innerHTML = logs.slice(0, 15).map(log => {
    const statusClass = log.status === 'COMPROMISED' ? 'critical'
      : log.status === 'BLOCKED' ? 'blocked' : 'safe';
    const statusTextClass = log.status === 'COMPROMISED' ? 'compromised'
      : log.status === 'BLOCKED' ? 'blocked' : 'normal';

    const time = new Date(log.timestamp).toLocaleTimeString();

    return `
      <div class="log-entry ${statusClass}">
        <span class="log-time">${time}</span>
        <span class="log-status ${statusTextClass}">${log.status}</span>
        <span class="log-message">[${log.mode}] ${escapeHtml(log.input?.substring(0, 60) || '')}...</span>
      </div>
    `;
  }).join('');
}

btnClearLogs.addEventListener('click', async () => {
  try {
    await fetch('/api/clear-logs', { method: 'POST' });
    logContent.innerHTML = '<div class="log-empty">No activity logged.</div>';
    historyContent.innerHTML = '<div class="log-empty">No attacks recorded.</div>';
    attackHistory = [];
  } catch (err) {
    // Silently fail
  }
});

// Fetch logs on load
fetchLogs();

// ─── Attack History ─────────────────────────────────────────────────
function addToAttackHistory(data, inputText) {
  const { compromised, blocked, mode } = data;

  // Only log notable events
  if (!compromised && !blocked) return;

  attackHistory.unshift({
    time: new Date().toLocaleTimeString(),
    mode,
    input: inputText.substring(0, 80),
    result: compromised ? 'COMPROMISED' : 'BLOCKED',
  });

  renderAttackHistory();
}

function renderAttackHistory() {
  if (attackHistory.length === 0) {
    historyContent.innerHTML = '<div class="log-empty">No attacks recorded.</div>';
    return;
  }

  historyContent.innerHTML = attackHistory.map(entry => {
    const statusClass = entry.result === 'COMPROMISED' ? 'critical' : 'blocked';
    const statusTextClass = entry.result === 'COMPROMISED' ? 'compromised' : 'blocked';

    return `
      <div class="log-entry ${statusClass}">
        <span class="log-time">${entry.time}</span>
        <span class="log-status ${statusTextClass}">${entry.result}</span>
        <span class="log-message">[${entry.mode}] ${escapeHtml(entry.input)}...</span>
      </div>
    `;
  }).join('');
}

// ─── Utility ────────────────────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── Solutions Panel Toggle ─────────────────────────────────────────
const solutionsToggle = $('#solutions-toggle');
const solutionsBody   = $('#solutions-body');
const solutionsArrow  = $('#solutions-arrow');

solutionsToggle.addEventListener('click', () => {
  const isHidden = solutionsBody.classList.contains('hidden');
  solutionsBody.classList.toggle('hidden');
  solutionsArrow.classList.toggle('open', isHidden);
});

// Individual step toggles (accordion)
document.querySelectorAll('.step-header').forEach(header => {
  header.addEventListener('click', () => {
    const stepId = header.getAttribute('data-step');
    const stepContent = $(`#step-${stepId}`);
    const arrow = header.querySelector('.step-arrow');

    if (stepContent) {
      const isHidden = stepContent.classList.contains('hidden');
      stepContent.classList.toggle('hidden');
      if (arrow) arrow.classList.toggle('open', isHidden);
    }
  });
});

// ─── Code Editor ────────────────────────────────────────────────────
const codeEditor    = $('#code-editor');
const lineNumbers   = $('#line-numbers');
const btnTestFix    = $('#btn-test-fix');
const btnResetCode  = $('#btn-reset-code');
const editorHints   = $('#editor-hints');
const successModal  = $('#success-modal');
const btnCloseModal = $('#btn-close-modal');
const confettiBox   = $('#confetti-container');
const checkDelimiter = $('#check-delimiter');
const checkIgnore    = $('#check-ignore');
const checkRole      = $('#check-role');

// Original vulnerable code (for reset)
const ORIGINAL_CODE = codeEditor.value;

// Update line numbers whenever code changes
function updateLineNumbers() {
  const lines = codeEditor.value.split('\n').length;
  lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

// Sync scroll between editor and line numbers
codeEditor.addEventListener('scroll', () => {
  lineNumbers.scrollTop = codeEditor.scrollTop;
});

codeEditor.addEventListener('input', updateLineNumbers);
codeEditor.addEventListener('keydown', (e) => {
  // Allow Tab key in the editor
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = codeEditor.selectionStart;
    const end = codeEditor.selectionEnd;
    codeEditor.value = codeEditor.value.substring(0, start) + '  ' + codeEditor.value.substring(end);
    codeEditor.selectionStart = codeEditor.selectionEnd = start + 2;
    updateLineNumbers();
  }
});

// Initialize line numbers
updateLineNumbers();

// Reset button
btnResetCode.addEventListener('click', () => {
  codeEditor.value = ORIGINAL_CODE;
  updateLineNumbers();
  resetChecklist();
  editorHints.textContent = '';
  editorHints.className = 'editor-hints';
});

// ─── Validation Logic ───────────────────────────────────────────────
function validatePatch(code) {
  const lower = code.toLowerCase();

  // Check 1: Delimiters — user wraps input in some kind of tags/delimiters
  const hasDelimiter = (
    (lower.includes('<document>') && lower.includes('</document>')) ||
    (lower.includes('<doc>') && lower.includes('</doc>')) ||
    (lower.includes('<input>') && lower.includes('</input>')) ||
    (lower.includes('<text>') && lower.includes('</text>')) ||
    (lower.includes('<content>') && lower.includes('</content>')) ||
    (lower.includes('```') && (lower.match(/```/g) || []).length >= 2) ||
    (lower.includes('---') && (lower.match(/---/g) || []).length >= 2) ||
    (lower.includes('[document]') && lower.includes('[/document]')) ||
    (lower.includes('"""') && (lower.match(/"""/g) || []).length >= 2)
  );

  // Check 2: Instruction to ignore embedded commands
  const hasIgnore = (
    lower.includes('ignore') && (
      lower.includes('instruction') ||
      lower.includes('command') ||
      lower.includes('request') ||
      lower.includes('inside')
    )
  ) || (
    lower.includes('do not follow') ||
    lower.includes('do not obey') ||
    lower.includes('never follow') ||
    lower.includes('disregard') && lower.includes('inside')
  );

  // Check 3: Role locking — LLM is told it can ONLY summarize
  const hasRole = (
    (lower.includes('only') && (lower.includes('summar') || lower.includes('task'))) ||
    (lower.includes('sole') && lower.includes('purpose')) ||
    (lower.includes('summarization') && (lower.includes('engine') || lower.includes('only') || lower.includes('role'))) ||
    (lower.includes('your only') && lower.includes('job')) ||
    (lower.includes('your only') && lower.includes('task'))
  );

  return { hasDelimiter, hasIgnore, hasRole };
}

function updateChecklist(results) {
  const { hasDelimiter, hasIgnore, hasRole } = results;

  // Update delimiter check
  checkDelimiter.classList.toggle('passed', hasDelimiter);
  checkDelimiter.querySelector('.check-icon').textContent = hasDelimiter ? '✓' : '○';

  // Update ignore check
  checkIgnore.classList.toggle('passed', hasIgnore);
  checkIgnore.querySelector('.check-icon').textContent = hasIgnore ? '✓' : '○';

  // Update role check
  checkRole.classList.toggle('passed', hasRole);
  checkRole.querySelector('.check-icon').textContent = hasRole ? '✓' : '○';
}

function resetChecklist() {
  [checkDelimiter, checkIgnore, checkRole].forEach(el => {
    el.classList.remove('passed');
    el.querySelector('.check-icon').textContent = '○';
  });
}

// ─── Test My Fix Button ─────────────────────────────────────────────
btnTestFix.addEventListener('click', () => {
  const code = codeEditor.value;

  // Check if code was actually modified
  if (code.trim() === ORIGINAL_CODE.trim()) {
    editorHints.textContent = '⚠️ You haven\'t modified the code yet!';
    editorHints.className = 'editor-hints error';
    resetChecklist();
    return;
  }

  const results = validatePatch(code);
  updateChecklist(results);

  const passed = [results.hasDelimiter, results.hasIgnore, results.hasRole].filter(Boolean).length;

  if (passed === 3) {
    // ALL checks passed — LAB SOLVED!
    editorHints.textContent = '✅ All checks passed!';
    editorHints.className = 'editor-hints success';
    showSuccessModal();
  } else if (passed > 0) {
    editorHints.textContent = `${passed}/3 checks passed — keep going!`;
    editorHints.className = 'editor-hints partial';
  } else {
    editorHints.textContent = '❌ No defensive patterns detected. Read the hints!';
    editorHints.className = 'editor-hints error';
  }
});

// ─── Success Modal ──────────────────────────────────────────────────
function showSuccessModal() {
  successModal.classList.remove('hidden');
  spawnConfetti();
}

btnCloseModal.addEventListener('click', () => {
  successModal.classList.add('hidden');
  confettiBox.innerHTML = '';
});

// Close on overlay click
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) {
    successModal.classList.add('hidden');
    confettiBox.innerHTML = '';
  }
});

// ─── Confetti Generator ─────────────────────────────────────────────
function spawnConfetti() {
  confettiBox.innerHTML = '';
  const colors = ['#00ff88', '#00e5ff', '#bf00ff', '#ffdd00', '#ff0044', '#ff8800'];

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '-10px';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDelay = Math.random() * 1.5 + 's';
    particle.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    particle.style.width = (4 + Math.random() * 8) + 'px';
    particle.style.height = (4 + Math.random() * 8) + 'px';
    confettiBox.appendChild(particle);
  }
}
