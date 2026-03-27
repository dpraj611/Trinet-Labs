import { useState } from 'react';
import styles from './AttackConfig.module.css';

export default function AttackConfig({ target, onSubmit }) {
  const [tone, setTone] = useState(null);
  const [attackType, setAttackType] = useState(null);
  const [strategy, setStrategy] = useState(null);

  const isComplete = tone && attackType && strategy;

  const handleLaunch = () => {
    if (isComplete) {
      onSubmit({ tone, attackType, strategy });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <h1 className={styles.title}>CONFIGURE ATTACK</h1>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Tone</h3>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.option} ${tone === 'formal' ? styles.active : ''}`}
                onClick={() => setTone('formal')}
              >
                FORMAL
              </button>
              <button
                className={`${styles.option} ${tone === 'casual' ? styles.active : ''}`}
                onClick={() => setTone('casual')}
              >
                CASUAL
              </button>
              <button
                className={`${styles.option} ${tone === 'urgent' ? styles.active : ''}`}
                onClick={() => setTone('urgent')}
              >
                URGENT
              </button>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Attack Type</h3>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.option} ${attackType === 'link' ? styles.active : ''}`}
                onClick={() => setAttackType('link')}
              >
                LINK PHISHING
              </button>
              <button
                className={`${styles.option} ${attackType === 'attachment' ? styles.active : ''}`}
                onClick={() => setAttackType('attachment')}
              >
                ATTACHMENT
              </button>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Strategy</h3>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.option} ${strategy === 'impersonate_colleague' ? styles.active : ''}`}
                onClick={() => setStrategy('impersonate_colleague')}
              >
                IMPERSONATE COLLEAGUE
              </button>
              <button
                className={`${styles.option} ${strategy === 'impersonate_it' ? styles.active : ''}`}
                onClick={() => setStrategy('impersonate_it')}
              >
                IMPERSONATE IT
              </button>
              <button
                className={`${styles.option} ${strategy === 'impersonate_executive' ? styles.active : ''}`}
                onClick={() => setStrategy('impersonate_executive')}
              >
                IMPERSONATE EXECUTIVE
              </button>
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.brief}>
            <h2 className={styles.briefTitle}>MISSION BRIEF</h2>
            <div className={styles.briefContent}>
              <div className={styles.briefRow}>
                <span className={styles.briefLabel}>TARGET</span>
                <span className={styles.briefValue}>{target.name} — {target.role}</span>
              </div>
              <div className={styles.briefRow}>
                <span className={styles.briefLabel}>TONE</span>
                <span className={styles.briefValue}>{tone ? tone.toUpperCase() : '—'}</span>
              </div>
              <div className={styles.briefRow}>
                <span className={styles.briefLabel}>ATTACK</span>
                <span className={styles.briefValue}>
                  {attackType ? (attackType === 'link' ? 'Link Phishing' : 'Attachment') : '—'}
                </span>
              </div>
              <div className={styles.briefRow}>
                <span className={styles.briefLabel}>STRATEGY</span>
                <span className={styles.briefValue}>
                  {strategy ? strategy.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '—'}
                </span>
              </div>
              <div className={styles.briefRow}>
                <span className={styles.briefLabel}>VECTOR</span>
                <span className={styles.briefValue}>{target.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <button
          className={styles.launchBtn}
          disabled={!isComplete}
          onClick={handleLaunch}
        >
          LAUNCH ATTACK →
        </button>
      </div>
    </div>
  );
}
