import { templates } from './templates.js';

export function selectTemplate(config, attemptNumber, previousFailureReason) {
  if (attemptNumber === 1) {
    if (config.tone === 'urgent' && config.strategy === 'impersonate_it') return templates.find(t => t.id === 'URGENT_IT');
    if (config.tone === 'casual') return templates.find(t => t.id === 'CASUAL_COLLEAGUE');
    if (config.tone === 'formal' && config.strategy === 'impersonate_executive') return templates.find(t => t.id === 'FORMAL_EXECUTIVE');
    if (config.attackType === 'attachment') return templates.find(t => t.id === 'ATTACHMENT_SPEAR');
    return templates.find(t => t.id === 'CASUAL_COLLEAGUE');
  }

  if (attemptNumber === 2) {
    if (previousFailureReason?.includes('urgency')) return templates.find(t => t.id === 'CASUAL_MODIFIED');
    if (previousFailureReason?.includes('domain')) return templates.find(t => t.id === 'CASUAL_COLLEAGUE');
    if (previousFailureReason?.includes('sender')) return templates.find(t => t.id === 'FORMAL_CLEAN');
    return templates.find(t => t.id === 'CASUAL_MODIFIED');
  }

  return templates.find(t => t.id === 'FORMAL_CLEAN');
}

export function buildEmail(target, config, template) {
  const senderMap = {
    impersonate_it: 'it-support@trinetlayer-helpdesk.net',
    impersonate_colleague: `${target.name.split(' ')[0].toLowerCase()}.colleague@trinetlayer.co`,
    impersonate_executive: 'ceo-office@trinetlayer-exec.com'
  };

  const sender = senderMap[template.strategy] || 'noreply@trinetlayer.co';
  const interest = target.interests[0];
  const event = target.recentActivity;

  const personalize = (str) =>
    str
      .replace(/{name}/g, target.name.split(' ')[0])
      .replace(/{interest}/g, interest)
      .replace(/{event}/g, event)
      .replace(/{sender}/g, sender);

  return {
    subject: personalize(template.subject),
    body: personalize(template.body),
    from: sender,
    to: target.email,
    tone: template.tone,
    strategy: template.strategy,
    attackType: template.attackType,
    templateId: template.id,
    templateName: template.name,
    keywords: template.keywords,
    timestamp: new Date().toISOString()
  };
}
