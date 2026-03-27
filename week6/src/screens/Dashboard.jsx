import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function Dashboard({ report, onReset, onDefenseMode }) {
  const [expandedAttempts, setExpandedAttempts] = useState([]);

  if (!report) return null;

  const { totalAttempts, blocked, breached, highestScore, attempts } = report;

  const toggleExpand = (idx) => {
    setExpandedAttempts(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const getDecisionColor = (color) => {
    if (color === 'green') return styles.green;
    if (color === 'yellow') return styles.yellow;
    if (color === 'red') return styles.red;
    return styles.green;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>FINAL REPORT</h1>

      <div className={styles.metrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Attempts</div>
          <div className={styles.metricValue}>{totalAttempts}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Emails Blocked</div>
          <div className={styles.metricValue}>{blocked}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Final Outcome</div>
          <div className={`${styles.metricValue} ${breached ? styles.breach : styles.contained}`}>
            {breached ? 'BREACH' : 'CONTAINED'}
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Highest Risk Score</div>
          <div className={styles.metricValue}>{highestScore} / 10</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>EMAIL EVOLUTION</h2>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.col1}>Attempt</div>
            <div className={styles.col2}>Template</div>
            <div className={styles.col3}>Tone</div>
            <div className={styles.col4}>Strategy</div>
            <div className={styles.col5}>Score</div>
            <div className={styles.col6}>Decision</div>
          </div>
          {attempts.map((att, idx) => (
            <div key={idx}>
              <div
                className={`${styles.tableRow} ${expandedAttempts.includes(idx) ? styles.expanded : ''}`}
                onClick={() => toggleExpand(idx)}
              >
                <div className={styles.col1}>#{att.attemptNumber}</div>
                <div className={styles.col2}>{att.email.templateName}</div>
                <div className={styles.col3}>{att.email.tone}</div>
                <div className={styles.col4}>{att.email.strategy.replace(/_/g, ' ')}</div>
                <div className={styles.col5}>{att.result.score}</div>
                <div className={styles.col6}>
                  <span className={`${styles.badge} ${getDecisionColor(att.result.decisionColor)}`}>
                    {att.result.decisionLabel}
                  </span>
                </div>
                <div className={styles.expandIcon}>
                  {expandedAttempts.includes(idx) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
              {expandedAttempts.includes(idx) && (
                <div className={styles.expandedContent}>
                  <h4>Detection Reasons:</h4>
                  <ul>
                    {att.result.reasons.map((reason, ridx) => (
                      <li key={ridx}>
                        <strong>+{reason.points} pts:</strong> {reason.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>LAB REFLECTION</h2>
        <div className={styles.reflection}>
          <h3>KEY OBSERVATIONS</h3>
          <ul>
            <li>Adaptive attackers iteratively narrow the detection gap in rule-based systems</li>
            <li>Urgency keywords are reliably caught — experienced attackers shift to neutral tone</li>
            <li>Domain spoofing is a primary detection signal; look-alike domains evade basic checks</li>
            <li>Multi-attempt spear-phishing improves delivery rates significantly in real-world studies</li>
            <li>Rule-based defenders are brittle: they catch known patterns but miss novel phrasing</li>
          </ul>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.resetBtn} onClick={onReset}>
          ↺ RESET SIMULATION
        </button>
        <button className={styles.defenseBtn} onClick={onDefenseMode}>
          SWITCH TO DEFENSE MODE →
        </button>
      </div>
    </div>
  );
}
