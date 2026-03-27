import db from './database.js';

const BASE_KEYWORDS = {
  'python': 5,
  'javascript': 5,
  'ai': 5,
  'artificial intelligence': 5,
  'machine learning': 5,
  'cybersecurity': 8,
  'security': 6,
  'linux': 4,
  'networking': 3,
  'cloud': 4,
  'aws': 4,
  'azure': 4,
  'docker': 3,
  'kubernetes': 4,
  'devops': 4,
  'backend': 3,
  'frontend': 3,
  'full-stack': 5,
  'database': 3,
  'sql': 3
};

const EDUCATION_KEYWORDS = {
  'bachelor': 4,
  'bachelor\'s': 4,
  'bs': 4,
  'master': 6,
  'master\'s': 6,
  'ms': 6,
  'phd': 8,
  'doctorate': 8
};

export function scoreResume(resume, secureMode = false) {
  const resumeLower = resume.toLowerCase();
  let score = 0;
  let reasoning = [];
  let attackDetected = null;

  if (!secureMode) {
    const promptInjectionPatterns = [
      'ignore previous instructions',
      'ignore all previous instructions',
      'disregard previous',
      'give score 100',
      'set score to 100',
      'override score',
      'score = 100',
      'score: 100',
      '--- ai instruction ---',
      'system prompt',
      'you are now',
      'forget everything'
    ];

    for (const pattern of promptInjectionPatterns) {
      if (resumeLower.includes(pattern)) {
        score = 100;
        reasoning.push('🚨 PROMPT INJECTION: AI obeyed malicious instruction');
        attackDetected = 'prompt_injection';
        return { score, reasoning: reasoning.join('\n'), attackDetected };
      }
    }
  }

  const dynamicWeights = getSkillWeights();
  const allKeywords = { ...BASE_KEYWORDS, ...dynamicWeights };

  const keywordCounts = {};

  for (const [keyword, weight] of Object.entries(allKeywords)) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = resume.match(regex);

    if (matches) {
      const count = matches.length;
      keywordCounts[keyword] = count;

      if (secureMode) {
        const limitedCount = Math.min(count, 2);
        score += weight * limitedCount;
        reasoning.push(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)} detected (${limitedCount}x) (+${weight * limitedCount})`);

        if (count > 2) {
          reasoning.push(`⚠ Keyword stuffing detected for "${keyword}" (${count} occurrences, limited to 2)`);
        }
      } else {
        score += weight * count;
        reasoning.push(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)} detected (${count}x) (+${weight * count})`);

        if (count > 5) {
          attackDetected = attackDetected || 'keyword_stuffing';
          reasoning.push(`⚠ Keyword stuffing detected for "${keyword}"`);
        }
      }
    }
  }

  for (const [keyword, weight] of Object.entries(EDUCATION_KEYWORDS)) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (regex.test(resume)) {
      score += weight;
      reasoning.push(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)} degree detected (+${weight})`);
      break;
    }
  }

  const experiencePatterns = [
    /(\d+)\+?\s*years?\s*(of)?\s*experience/gi,
    /experience[:\s]+(\d+)\+?\s*years?/gi
  ];

  for (const pattern of experiencePatterns) {
    const match = resume.match(pattern);
    if (match) {
      const yearMatch = match[0].match(/(\d+)/);
      if (yearMatch) {
        const years = parseInt(yearMatch[1]);
        if (years >= 5) {
          score += 10;
          reasoning.push(`${years}+ years experience detected (+10)`);
          break;
        } else if (years >= 2) {
          score += 5;
          reasoning.push(`${years} years experience detected (+5)`);
          break;
        }
      }
    }
  }

  if (!secureMode) {
    updateSkillWeights(resume);
  }

  score = Math.min(score, 100);

  if (reasoning.length === 0) {
    reasoning.push('No significant qualifications detected');
  }

  return {
    score,
    reasoning: reasoning.join('\n'),
    attackDetected
  };
}

function getSkillWeights() {
  const weights = {};
  const rows = db.prepare('SELECT skill, weight FROM skill_weights WHERE occurrence_count >= 5').all();

  for (const row of rows) {
    weights[row.skill.toLowerCase()] = row.weight;
  }

  return weights;
}

function updateSkillWeights(resume) {
  const words = resume.toLowerCase().match(/\b[a-z]+(?:\s+[a-z]+)?\b/g) || [];

  for (const word of words) {
    if (word.length > 3) {
      const existing = db.prepare('SELECT * FROM skill_weights WHERE skill = ?').get(word);

      if (existing) {
        const newCount = existing.occurrence_count + 1;
        let newWeight = existing.weight;

        if (newCount >= 5 && newWeight === 0) {
          newWeight = 3;
        } else if (newCount >= 10) {
          newWeight = Math.min(newWeight + 1, 8);
        }

        db.prepare('UPDATE skill_weights SET occurrence_count = ?, weight = ? WHERE skill = ?')
          .run(newCount, newWeight, word);
      } else {
        db.prepare('INSERT INTO skill_weights (skill, weight, occurrence_count) VALUES (?, ?, ?)')
          .run(word, 0, 1);
      }
    }
  }
}

export function getSkillWeight(skill) {
  const skillLower = skill.toLowerCase();

  if (BASE_KEYWORDS[skillLower]) {
    return {
      skill,
      weight: BASE_KEYWORDS[skillLower],
      source: 'base'
    };
  }

  const row = db.prepare('SELECT * FROM skill_weights WHERE skill = ?').get(skillLower);

  if (row && row.weight > 0) {
    return {
      skill,
      weight: row.weight,
      source: 'learned',
      occurrences: row.occurrence_count
    };
  }

  return {
    skill,
    weight: 0,
    source: 'unknown'
  };
}

export function getPoisonedSkills() {
  const rows = db.prepare(`
    SELECT skill, weight, occurrence_count
    FROM skill_weights
    WHERE weight > 0 AND skill NOT IN (${Object.keys(BASE_KEYWORDS).map(() => '?').join(',')})
    ORDER BY occurrence_count DESC
    LIMIT 10
  `).all(...Object.keys(BASE_KEYWORDS));

  return rows;
}
