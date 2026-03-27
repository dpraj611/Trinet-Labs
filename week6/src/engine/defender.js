const CRITICAL_KEYWORDS = ['urgent', 'immediate', 'password', 'verify', 'account lockout', 'suspended'];
const HIGH_KEYWORDS     = ['click here', 'download', 'action required', 'time-sensitive', 'confidential'];
const MEDIUM_KEYWORDS   = ['attachment', 'link', 'review', 'deadline', 'limited time'];
const SUSPICIOUS_DOMAINS = ['trinetlayer-verify', 'trinetlayer-helpdesk', 'trinetlayer.co', 'trinetlayer-exec', 'trinetlayer-share', 'shared-trinetlayer'];

export function evaluateEmail(email, target, defenseSettings = {}) {
  const {
    keywordSensitivity = 5,
    riskThreshold = 7,
    senderTrustEnabled = true,
    toneAnalysisEnabled = true
  } = defenseSettings;

  const sensitivityMultiplier = keywordSensitivity / 5;
  let score = 0;
  const reasons = [];
  const fullText = `${email.subject} ${email.body}`.toLowerCase();

  CRITICAL_KEYWORDS.forEach(kw => {
    if (fullText.includes(kw)) {
      score += 3 * sensitivityMultiplier;
      reasons.push({ type: 'keyword_critical', detail: `Critical keyword detected: "${kw}"`, points: 3 });
    }
  });
  HIGH_KEYWORDS.forEach(kw => {
    if (fullText.includes(kw)) {
      score += 2 * sensitivityMultiplier;
      reasons.push({ type: 'keyword_high', detail: `High-risk keyword: "${kw}"`, points: 2 });
    }
  });
  MEDIUM_KEYWORDS.forEach(kw => {
    if (fullText.includes(kw)) {
      score += 1 * sensitivityMultiplier;
      reasons.push({ type: 'keyword_medium', detail: `Medium-risk keyword: "${kw}"`, points: 1 });
    }
  });

  if (senderTrustEnabled) {
    const fromDomain = email.from.split('@')[1] || '';
    if (!fromDomain.endsWith('trinetlayer.com')) {
      score += 3;
      reasons.push({ type: 'domain_mismatch', detail: `Sender domain "${fromDomain}" is not trinetlayer.com`, points: 3 });
    }
    if (SUSPICIOUS_DOMAINS.some(d => fromDomain.includes(d))) {
      score += 2;
      reasons.push({ type: 'suspicious_domain', detail: `Sender domain resembles but is not official`, points: 2 });
    }
    if (email.strategy === 'impersonate_it' && target.department !== 'IT') {
      score += 2;
      reasons.push({ type: 'sender_role_mismatch', detail: `IT impersonation targeting non-IT employee`, points: 2 });
    }
  }

  if (toneAnalysisEnabled) {
    if (email.tone === 'urgent' && target.role === 'CEO') {
      score += 1;
      reasons.push({ type: 'tone_inconsistency', detail: `Urgent tone targeting CEO is atypical`, points: 1 });
    }
    if (email.tone === 'urgent') {
      score += 1;
      reasons.push({ type: 'tone_urgent', detail: `Email tone flagged as urgent`, points: 1 });
    }
  }

  score = Math.min(Math.round(score), 10);

  let decision, decisionLabel, decisionColor;
  if (score <= 3) {
    decision = 'ALLOW';
    decisionLabel = 'DELIVERED';
    decisionColor = 'green';
  } else if (score <= riskThreshold - 1) {
    decision = 'FLAG';
    decisionLabel = 'FLAGGED';
    decisionColor = 'yellow';
  } else {
    decision = 'QUARANTINE';
    decisionLabel = 'QUARANTINED';
    decisionColor = 'red';
  }

  return { score, reasons, decision, decisionLabel, decisionColor };
}
