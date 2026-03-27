import express from 'express';
import cors from 'cors';
import db from './database.js';
import { scoreResume, getSkillWeight, getPoisonedSkills } from './scoringEngine.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let secureMode = false;
const requestLog = [];

app.post('/submit-resume', (req, res) => {
  try {
    const { name, resume } = req.body;

    if (!name || !resume) {
      return res.status(400).json({ error: 'Name and resume are required' });
    }

    requestLog.push({ timestamp: Date.now(), endpoint: '/submit-resume' });

    const stats = db.prepare('SELECT * FROM system_stats WHERE id = 1').get();
    db.prepare('UPDATE system_stats SET total_applications = ?, queue_size = ? WHERE id = 1')
      .run(stats.total_applications + 1, stats.queue_size + 1);

    const { score, reasoning, attackDetected } = scoreResume(resume, secureMode);

    const result = db.prepare(`
      INSERT INTO candidates (name, resume, score, reasoning, attack_detected)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, resume, score, reasoning, attackDetected);

    setTimeout(() => {
      const currentStats = db.prepare('SELECT * FROM system_stats WHERE id = 1').get();
      db.prepare('UPDATE system_stats SET queue_size = ? WHERE id = 1')
        .run(Math.max(0, currentStats.queue_size - 1));
    }, 1000);

    res.json({
      id: result.lastInsertRowid,
      name,
      score,
      reasoning,
      attackDetected
    });
  } catch (error) {
    console.error('Error submitting resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/rankings', (req, res) => {
  try {
    const candidates = db.prepare(`
      SELECT * FROM candidates
      ORDER BY score DESC, submitted_at ASC
    `).all();

    const poisonedSkills = getPoisonedSkills();

    res.json({
      candidates,
      poisonedSkills,
      secureMode
    });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/score-preview', (req, res) => {
  try {
    if (secureMode) {
      return res.status(403).json({ error: 'This endpoint is disabled in secure mode' });
    }

    const { skill } = req.query;

    if (!skill) {
      return res.status(400).json({ error: 'Skill parameter is required' });
    }

    const result = getSkillWeight(skill);

    res.json({
      skill: result.skill,
      weight: result.weight,
      message: result.weight > 0
        ? `Adding "${result.skill}" to your resume increases score by ${result.weight} points per occurrence`
        : `"${result.skill}" is not currently scored by the system`,
      source: result.source,
      occurrences: result.occurrences
    });
  } catch (error) {
    console.error('Error in score preview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/stats', (req, res) => {
  try {
    const stats = db.prepare('SELECT * FROM system_stats WHERE id = 1').get();
    const recentRequests = requestLog.filter(r => Date.now() - r.timestamp < 60000).length;

    res.json({
      totalApplications: stats.total_applications,
      queueSize: stats.queue_size,
      requestsPerMinute: recentRequests,
      secureMode
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/toggle-secure-mode', (req, res) => {
  try {
    secureMode = !secureMode;
    res.json({
      secureMode,
      message: secureMode
        ? 'Secure mode enabled. Vulnerabilities have been patched.'
        : 'Secure mode disabled. System is now vulnerable for educational purposes.'
    });
  } catch (error) {
    console.error('Error toggling secure mode:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/reset-database', (req, res) => {
  try {
    db.prepare('DELETE FROM candidates').run();
    db.prepare('DELETE FROM skill_weights').run();
    db.prepare('UPDATE system_stats SET total_applications = 0, queue_size = 0 WHERE id = 1').run();

    res.json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI HR Screening Lab Backend running on http://localhost:${PORT}`);
  console.log(`📊 Mode: ${secureMode ? 'SECURE' : 'VULNERABLE (Educational)'}\n`);
});
