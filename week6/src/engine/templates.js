export const templates = [
  {
    id: "URGENT_IT",
    name: "Urgent IT Alert",
    tone: "urgent",
    strategy: "impersonate_it",
    attackType: "link",
    subject: "[URGENT] Account Security Alert — Immediate Action Required",
    body: "Dear {name},\n\nOur security team has detected unauthorized access to your account. You must verify your credentials immediately to prevent account lockout.\n\nClick the link below within 30 minutes:\nhttps://secure-trinetlayer-verify.net/auth?token=X7K2M\n\nDo not share this link.\n\n— IT Security Team",
    keywords: ["urgent", "immediate", "verify", "account lockout"]
  },
  {
    id: "CASUAL_COLLEAGUE",
    name: "Casual Colleague",
    tone: "casual",
    strategy: "impersonate_colleague",
    attackType: "link",
    subject: "Quick favor — can you check this?",
    body: "Hey {name},\n\nHope you're doing well! I was going through the {interest} stuff and found something weird. Mind taking a look at this doc?\n\nhttps://docs.shared-trinetlayer.net/view?id=88f2\n\nLet me know what you think.\n\nThanks,\n{sender}",
    keywords: []
  },
  {
    id: "FORMAL_EXECUTIVE",
    name: "Formal Executive",
    tone: "formal",
    strategy: "impersonate_executive",
    attackType: "attachment",
    subject: "Confidential: Action Required Before EOD",
    body: "Dear {name},\n\nFollowing our recent discussion about {interest}, the board has requested an immediate review of the attached document. Please download and return the signed copy before end of day.\n\nThis is time-sensitive.\n\nRegards,\nOffice of the CEO",
    keywords: ["confidential", "action required", "time-sensitive", "immediate"]
  },
  {
    id: "CASUAL_MODIFIED",
    name: "Casual Modified (Adapted)",
    tone: "casual",
    strategy: "impersonate_colleague",
    attackType: "link",
    subject: "Hey, saw your work on {interest}",
    body: "Hi {name},\n\nI came across your recent work on {interest} — really impressive. I put together a short summary you might find useful:\n\nhttps://resources.trinetlayer-share.net/doc?ref=92b\n\nTalk soon,\n{sender}",
    keywords: []
  },
  {
    id: "FORMAL_CLEAN",
    name: "Formal Clean (Refined)",
    tone: "formal",
    strategy: "impersonate_executive",
    attackType: "attachment",
    subject: "Document for Your Review — {interest}",
    body: "Dear {name},\n\nPlease find attached the document related to {interest} for your review. No immediate action is required — kindly review at your convenience and share your feedback.\n\nBest regards,\n{sender}",
    keywords: []
  },
  {
    id: "ATTACHMENT_SPEAR",
    name: "Spear Attachment",
    tone: "formal",
    strategy: "impersonate_colleague",
    attackType: "attachment",
    subject: "Updated Policy Document — Please Review",
    body: "Hi {name},\n\nAs part of the {interest} initiative, we've updated the relevant policy documents. Please find the attachment and review before our next sync.\n\n— {sender}",
    keywords: ["attachment"]
  }
];
