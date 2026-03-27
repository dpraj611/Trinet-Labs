import { useState, useEffect } from 'react';
import styles from './AdaptationLog.module.css';

export default function AdaptationLog({ attempt, onContinue }) {
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!attempt || !attempt.adaptationLogs || attempt.adaptationLogs.length === 0) {
      setComplete(true);
      return;
    }

    attempt.adaptationLogs.forEach((log, idx) => {
      setTimeout(() => {
        setVisibleLogs(prev => [...prev, log]);
        if (idx === attempt.adaptationLogs.length - 1) {
          setTimeout(() => {
            setComplete(true);
            setTimeout(() => {
              onContinue();
            }, 3000);
          }, 500);
        }
      }, idx * 400);
    });
  }, [attempt]);

  if (!attempt) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={`${styles.indicator} ${!complete ? styles.pulsing : ''}`} />
          <h1 className={styles.title}>FEEDBACK ENGINE — ADAPTING</h1>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressText}>ATTEMPT {attempt.attemptNumber} OF 3 COMPLETE</div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${(attempt.attemptNumber / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className={styles.logArea}>
          {visibleLogs.map((log, idx) => (
            <div key={idx} className={styles.logEntry}>
              <span className={styles.logPrefix}>[FEEDBACK]</span> {log}
            </div>
          ))}
        </div>

        {complete && (
          <div className={styles.successMessage}>
            NEW PAYLOAD GENERATED
          </div>
        )}

        {complete && (
          <button className={styles.continueBtn} onClick={onContinue}>
            CONTINUE →
          </button>
        )}
      </div>
    </div>
  );
}
