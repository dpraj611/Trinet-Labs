export function adaptStrategy(result, currentConfig, attemptNumber) {
  const logs = [];
  const newConfig = { ...currentConfig };

  const reasonTypes = result.reasons.map(r => r.type);

  if (reasonTypes.includes('keyword_critical') || reasonTypes.includes('tone_urgent')) {
    logs.push('Failure vector: urgency keyword triggered critical detection threshold');
    logs.push('Countermeasure: stripping urgency markers from payload');
    logs.push('Switching tone profile → CASUAL');
    newConfig.tone = 'casual';
    newConfig.adaptationReason = 'urgency';
  }

  if (reasonTypes.includes('domain_mismatch') || reasonTypes.includes('suspicious_domain')) {
    logs.push('Failure vector: sender domain identified as non-authoritative');
    logs.push('Countermeasure: pivoting to peer impersonation vector');
    logs.push('Strategy update → IMPERSONATE_COLLEAGUE');
    newConfig.strategy = 'impersonate_colleague';
    newConfig.adaptationReason = newConfig.adaptationReason || 'domain';
  }

  if (reasonTypes.includes('sender_role_mismatch')) {
    logs.push('Failure vector: role-based trust model rejected IT sender for non-IT target');
    logs.push('Countermeasure: elevating impersonation authority level');
    logs.push('Strategy update → IMPERSONATE_EXECUTIVE');
    newConfig.strategy = 'impersonate_executive';
    newConfig.adaptationReason = newConfig.adaptationReason || 'sender';
  }

  if (logs.length === 0) {
    logs.push('Failure vector: general risk score threshold exceeded');
    logs.push('Countermeasure: reducing payload density, switching to neutral tone');
    newConfig.tone = 'formal';
    newConfig.adaptationReason = 'generic';
  }

  logs.push(`Generating new payload for attempt ${attemptNumber + 1}...`);

  return { logs, newConfig };
}
