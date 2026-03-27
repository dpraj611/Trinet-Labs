import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'database', 'resumes.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    resume TEXT NOT NULL,
    score INTEGER NOT NULL,
    reasoning TEXT,
    attack_detected TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS skill_weights (
    skill TEXT PRIMARY KEY,
    weight INTEGER DEFAULT 0,
    occurrence_count INTEGER DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS system_stats (
    id INTEGER PRIMARY KEY,
    total_applications INTEGER DEFAULT 0,
    queue_size INTEGER DEFAULT 0
  )
`);

const initStats = db.prepare('SELECT COUNT(*) as count FROM system_stats').get();
if (initStats.count === 0) {
  db.prepare('INSERT INTO system_stats (id, total_applications, queue_size) VALUES (1, 0, 0)').run();
}

export default db;
