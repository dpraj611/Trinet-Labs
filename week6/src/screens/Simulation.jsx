import { useState, useEffect } from 'react';
import LogPanel from '../components/LogPanel';
import EmailPreview from '../components/EmailPreview';
import styles from './Simulation.module.css';

function formatTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 8);
}

export default function Simulation({ controller, onAttemptComplete }) {
  const [attackerLogs, setAttackerLogs] = useState([]);
  const [defenderLogs, setDefenderLogs] = useState([]);
  const [showEmail, setShowEmail] = useState(false);
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    const attemptNumber = controller.state.currentAttempt + 1;
    const previousFailure = controller.state.config?.adaptationReason;

    const runSimulation = async () => {
      const result = controller.runAttempt(attemptNumber, previousFailure);
      setAttempt(result);

      const { email, result: evalResult } = result;
      const target = controller.state.target;

      const attackerMessages = [
        { text: 'Initializing attack sequence...', delay: 0 },
        { text: `Target acquired: ${target.name} (${target.role})`, delay: 500 },
        { text: 'Loading target intelligence...', delay: 1000 },
        { text: `Interest vector: ${target.interests[0]}`, delay: 1500 },
        { text: `Recent activity: ${target.recentActivity}`, delay: 2000 },
        { text: `Selecting attack template: ${email.templateName}`, delay: 2500 },
        { text: 'Personalizing payload with target data...', delay: 3000 },
        { text: `Spoofing sender identity: ${email.from}`, delay: 3500 },
        { text: 'Encoding email payload...', delay: 4000 },
        { text: `► Transmitting to ${email.to}...`, delay: 4500 }
      ];

      attackerMessages.forEach(({ text, delay }) => {
        setTimeout(() => {
          setAttackerLogs(prev => [...prev, { time: formatTime(), text, type: 'info' }]);
        }, delay);
      });

      setTimeout(() => {
        const defenderMessages = [
          { text: `Incoming message detected from ${email.from}`, delay: 0 },
          { text: 'Running sender verification...', delay: 400 },
          { text: `Domain check: ${email.from.split('@')[1]} → ${email.from.endsWith('trinetlayer.com') ? 'OK' : 'MISMATCH'}`, delay: 800, type: email.from.endsWith('trinetlayer.com') ? 'success' : 'warning' },
          { text: 'Scanning for keyword signatures...', delay: 1200 },
        ];

        const keywordReasons = evalResult.reasons.filter(r => r.type.startsWith('keyword'));
        if (keywordReasons.length > 0) {
          const keywords = keywordReasons.map(r => {
            const match = r.detail.match(/"([^"]+)"/);
            return match ? match[1] : '';
          }).filter(Boolean).join(', ');
          defenderMessages.push({ text: `Found: ${keywords} → +${keywordReasons.reduce((sum, r) => sum + r.points, 0)} pts`, delay: 1600, type: 'warning' });
        } else {
          defenderMessages.push({ text: 'No critical keywords detected', delay: 1600, type: 'success' });
        }

        defenderMessages.push({ text: `Tone classifier: ${email.tone} detected`, delay: 2000 });
        defenderMessages.push({ text: 'Role-context analysis complete', delay: 2400 });
        defenderMessages.push({ text: 'Computing aggregate risk score...', delay: 2800 });
        defenderMessages.push({ text: '─────────────────────────────', delay: 3200 });
        defenderMessages.push({ text: `RISK SCORE: ${evalResult.score} / 10`, delay: 3600, type: 'info' });
        defenderMessages.push({ text: `DECISION: ${evalResult.decisionLabel}`, delay: 4000, type: evalResult.decisionColor === 'green' ? 'success' : (evalResult.decisionColor === 'yellow' ? 'warning' : 'danger') });

        defenderMessages.forEach(({ text, delay, type = 'info' }) => {
          setTimeout(() => {
            setDefenderLogs(prev => [...prev, { time: formatTime(), text, type }]);
          }, delay);
        });

        setTimeout(() => {
          setShowEmail(true);
          setTimeout(() => {
            onAttemptComplete(result);
          }, 1500);
        }, 4500);
      }, 5000);
    };

    runSimulation();
  }, []);

  const attemptNumber = controller.state.currentAttempt + 1;

  return (
    <div className={styles.container}>
      <div className={styles.panels}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.attemptBadge}>ATTEMPT {attemptNumber} OF 3</span>
          </div>
          <LogPanel entries={attackerLogs} title="ATTACKER AGENT" indicatorColor="red" />
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            {defenderLogs.length > 0 && <span className={styles.statusBadge}>ANALYZING</span>}
          </div>
          <LogPanel entries={defenderLogs} title="DEFENDER AGENT" indicatorColor="green" />
        </div>
      </div>

      {showEmail && attempt && (
        <div className={styles.emailSection}>
          <h2 className={styles.emailTitle}>EMAIL PREVIEW</h2>
          <EmailPreview email={attempt.email} result={attempt.result} />
        </div>
      )}
    </div>
  );
}
